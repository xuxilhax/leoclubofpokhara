/**
 * Leo Club CMS — Authentication Library (Server Actions)
 * ----------------------------------------------------------------
 * Cookie-based session auth with bcrypt password hashing.
 *
 * ERROR HANDLING STRATEGY (Phase 3 fix):
 * - Every DB call is wrapped in try/catch
 * - Errors are classified (DB_DOWN, NOT_FOUND, AUTH_FAILED, INTERNAL)
 * - In development, the real error message is returned for debugging
 * - In production, a generic message is returned (no internal leakage)
 * - Audit log failures are swallowed (non-blocking) so login still succeeds
 *
 * This file is "use server" — only async functions can be exported.
 * For constants/types/sync helpers, import from "@/lib/auth-helpers".
 */
"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  type SessionUser,
  verifyPassword,
  createSessionToken,
  decodeSessionToken,
} from "@/lib/auth-helpers";

const SESSION_COOKIE = "leo_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const IS_DEV = process.env.NODE_ENV === "development";

/**
 * Login result — structured so the client can show appropriate messages.
 * `errorType` lets the client distinguish between "wrong password" and
 * "database is down" without leaking internal details.
 */
export type LoginResult = {
  success: boolean;
  error?: string;
  errorType?: "AUTH_FAILED" | "DB_ERROR" | "VALIDATION" | "INTERNAL";
  debug?: string; // Only populated in development
  user?: SessionUser;
};

/**
 * Safely execute a DB operation — catches connection errors, missing
 * table errors, and any other Prisma/runtime errors. Returns a typed
 * result so callers don't need their own try/catch.
 */
async function safeDb<T>(
  operation: () => Promise<T>,
  context: string
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[DB ERROR] ${context}:`, msg);

    // Check for common Prisma connection issues
    if (
      msg.includes("Can't reach database server") ||
      msg.includes("Connection refused") ||
      msg.includes("ECONNREFUSED") ||
      msg.includes("Tenant database") ||
      msg.includes("database file") ||
      msg.includes("does not exist")
    ) {
      return {
        data: null,
        error: IS_DEV
          ? `Database error: ${msg}`
          : "Database is temporarily unavailable.",
      };
    }

    // Check for missing env var
    if (msg.includes("DATABASE_URL") || msg.includes("env")) {
      return {
        data: null,
        error: IS_DEV
          ? `Missing DATABASE_URL environment variable.`
          : "Server configuration error.",
      };
    }

    // Generic fallback
    return {
      data: null,
      error: IS_DEV ? `DB error in ${context}: ${msg}` : "An internal error occurred.",
    };
  }
}

/**
 * Log in a user by email + password, set the session cookie.
 *
 * Error handling:
 * - DB failures return { success: false, errorType: "DB_ERROR" }
 * - Invalid credentials return { success: false, errorType: "AUTH_FAILED" }
 * - Missing input returns { success: false, errorType: "VALIDATION" }
 * - Audit log failures are SWALLOWED (login still succeeds)
 */
export async function login(
  email: string,
  password: string,
  remember: boolean = false
): Promise<LoginResult> {
  // ─── Input validation ─────────────────────────────────────
  if (!email || !password) {
    return {
      success: false,
      errorType: "VALIDATION",
      error: "Email and password are required.",
    };
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return {
      success: false,
      errorType: "VALIDATION",
      error: "Please enter a valid email address.",
    };
  }

  // ─── Look up user (safe DB call) ──────────────────────────
  const { data: user, error: dbError } = await safeDb(
    () => db.user.findUnique({ where: { email: normalizedEmail } }),
    "login.findUser"
  );

  if (dbError) {
    return {
      success: false,
      errorType: "DB_ERROR",
      error: dbError,
      debug: IS_DEV ? dbError : undefined,
    };
  }

  // Use generic "Invalid email or password" so we don't reveal
  // whether the email exists (prevents user enumeration)
  if (!user || !user.isActive) {
    return {
      success: false,
      errorType: "AUTH_FAILED",
      error: "Invalid email or password.",
    };
  }

  // ─── Verify password (bcrypt) ─────────────────────────────
  let passwordValid = false;
  try {
    passwordValid = await verifyPassword(password, user.passwordHash);
  } catch (err) {
    console.error("[AUTH] Password verification failed:", err);
    return {
      success: false,
      errorType: "INTERNAL",
      error: IS_DEV
        ? `Password hash verification failed: ${err instanceof Error ? err.message : String(err)}`
        : "An internal error occurred. Please try again.",
    };
  }

  if (!passwordValid) {
    return {
      success: false,
      errorType: "AUTH_FAILED",
      error: "Invalid email or password.",
    };
  }

  // ─── Update last login (non-blocking — don't fail login if this errors) ───
  await safeDb(
    () => db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }),
    "login.updateLastLogin"
  );

  // ─── Create session ───────────────────────────────────────
  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
  };

  let token: string;
  try {
    token = createSessionToken(sessionUser);
  } catch (err) {
    console.error("[AUTH] Token creation failed:", err);
    return {
      success: false,
      errorType: "INTERNAL",
      error: "Failed to create session. Please try again.",
    };
  }

  // ─── Set cookie ───────────────────────────────────────────
  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: remember ? SESSION_MAX_AGE : 60 * 60 * 24,
    });
  } catch (err) {
    console.error("[AUTH] Cookie set failed:", err);
    return {
      success: false,
      errorType: "INTERNAL",
      error: "Failed to establish session. Please try again.",
    };
  }

  // ─── Audit log (non-blocking — login succeeds even if this fails) ───
  // This is intentional: if the AuditLog table is missing or the DB
  // is flaky, the user should still be able to log in.
  safeDb(
    () =>
      db.auditLog.create({
        data: {
          userId: user.id,
          userName: user.name,
          action: "LOGIN",
          module: "auth",
          details: "User logged in",
        },
      }),
    "login.auditLog"
  ).catch(() => {
    /* swallowed — audit log is non-critical */
  });

  return { success: true, user: sessionUser };
}

/**
 * Log out the current user — clear the session cookie.
 * Audit log failures are swallowed so logout always succeeds.
 */
export async function logout(): Promise<{ success: boolean }> {
  try {
    const user = await getCurrentUser();

    // Try to log the logout, but don't block on it
    if (user) {
      safeDb(
        () =>
          db.auditLog.create({
            data: {
              userId: user.id,
              userName: user.name,
              action: "LOGOUT",
              module: "auth",
              details: "User logged out",
            },
          }),
        "logout.auditLog"
      ).catch(() => {
        /* swallowed */
      });
    }

    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    return { success: true };
  } catch (err) {
    console.error("[AUTH] Logout failed:", err);
    // Still try to clear the cookie
    try {
      const cookieStore = await cookies();
      cookieStore.delete(SESSION_COOKIE);
    } catch {
      /* ignore */
    }
    return { success: false };
  }
}

/**
 * Get the current logged-in user from the session cookie.
 * This is a pure decode — no DB call — so it's fast and safe.
 * Returns null if not authenticated or token is invalid.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return decodeSessionToken(token);
  } catch (err) {
    console.error("[AUTH] getCurrentUser failed:", err);
    return null;
  }
}

/**
 * Require auth — throws if not authenticated.
 * Use in server components that MUST have a logged-in user.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

/**
 * Record an audit log entry from a server action.
 * Non-blocking — failures are swallowed and logged.
 */
export async function recordAudit(
  user: SessionUser | null,
  action: string,
  module: string,
  details?: string,
  entityId?: string,
  entityName?: string
) {
  if (!user) return;
  await safeDb(
    () =>
      db.auditLog.create({
        data: {
          userId: user.id,
          userName: user.name,
          action,
          module,
          details,
          entityId,
          entityName,
        },
      }),
    `recordAudit.${module}.${action}`
  );
}

/**
 * DEBUG MODE — health check endpoint for the login flow.
 * Call this from the client to diagnose login issues.
 * Only returns detailed info in development.
 */
export async function getAuthDebugInfo(): Promise<{
  dbReachable: boolean;
  dbError?: string;
  userCount: number;
  demoAccounts: { email: string; exists: boolean; isActive: boolean }[];
  env: {
    NODE_ENV: string;
    DATABASE_URL_SET: boolean;
  };
}> {
  if (!IS_DEV) {
    return {
      dbReachable: false,
      userCount: 0,
      demoAccounts: [],
      env: { NODE_ENV: "production", DATABASE_URL_SET: !!process.env.DATABASE_URL },
    };
  }

  const { data: userCount, error: countError } = await safeDb(
    () => db.user.count(),
    "debug.userCount"
  );

  const demoEmails = ["admin@leo.club", "president@leo.club", "editor@leo.club"];
  const demoChecks = await Promise.all(
    demoEmails.map(async (email) => {
      const { data } = await safeDb(
        () => db.user.findUnique({ where: { email }, select: { email: true, isActive: true } }),
        `debug.checkUser.${email}`
      );
      return { email, exists: !!data, isActive: data?.isActive ?? false };
    })
  );

  return {
    dbReachable: !countError,
    dbError: countError || undefined,
    userCount: userCount ?? 0,
    demoAccounts: demoChecks,
    env: {
      NODE_ENV: process.env.NODE_ENV || "development",
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
    },
  };
}
