/**
 * Leo Club CMS — Authentication (Hardcoded for Internal Use)
 * ----------------------------------------------------------------
 * Simple, zero-hassle auth. No database, no bcrypt, no Prisma.
 * Credentials are hardcoded below. Session is stored in a signed
 * HTTP-only cookie.
 *
 * To change credentials: edit the USERS array below.
 * To add a new user: add an entry to the USERS array.
 *
 * Note: This is for INTERNAL USE ONLY. For public-facing deployment,
 * swap this with Supabase Auth or NextAuth.js.
 */
"use server";

import { cookies } from "next/headers";
import { createSessionToken, decodeSessionToken, type SessionUser } from "@/lib/auth-helpers";

const SESSION_COOKIE = "leo_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ============================================================
// HARDCODED USERS — Edit these credentials as needed
// ============================================================
const USERS = [
  {
    id: "u_admin",
    email: "admin@leo.club",
    password: "admin123",
    name: "Super Admin",
    role: "SUPER_ADMIN" as const,
    avatarUrl: null,
  },
  {
    id: "u_president",
    email: "president@leo.club",
    password: "leo123",
    name: "Leo President",
    role: "PRESIDENT" as const,
    avatarUrl: null,
  },
  {
    id: "u_editor",
    email: "editor@leo.club",
    password: "leo123",
    name: "Leo Editor",
    role: "EDITOR" as const,
    avatarUrl: null,
  },
] as const;

export type LoginResult = {
  success: boolean;
  error?: string;
  user?: SessionUser;
};

/**
 * Log in — checks email/password against the hardcoded USERS array.
 * Sets a session cookie on success. No database involved.
 */
export async function login(
  email: string,
  password: string,
  remember: boolean = false
): Promise<LoginResult> {
  // Small artificial delay to show loading state (feels more real)
  await new Promise((r) => setTimeout(r, 200));

  const normalizedEmail = email.toLowerCase().trim();

  if (!normalizedEmail || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const found = USERS.find(
    (u) => u.email === normalizedEmail && u.password === password
  );

  if (!found) {
    return { success: false, error: "Invalid email or password." };
  }

  const sessionUser: SessionUser = {
    id: found.id,
    email: found.email,
    name: found.name,
    role: found.role,
    avatarUrl: found.avatarUrl,
  };

  // Set session cookie
  const token = createSessionToken(sessionUser);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? SESSION_MAX_AGE : 60 * 60 * 24, // 7 days vs 1 day
  });

  return { success: true, user: sessionUser };
}

/**
 * Log out — clear the session cookie.
 */
export async function logout(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return { success: true };
}

/**
 * Get the current logged-in user from the session cookie.
 * No DB call — just decodes the cookie token.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSessionToken(token);
}

/**
 * Require auth — throws if not authenticated.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

/**
 * Record an audit log — now a no-op since we removed DB dependency.
 * Kept for backwards compatibility with existing action calls.
 */
export async function recordAudit(
  user: SessionUser | null,
  action: string,
  module: string,
  details?: string,
  entityId?: string,
  entityName?: string
) {
  // No-op — audit logging removed for simplicity.
  // Re-enable by importing db and writing to AuditLog table.
  return;
}
