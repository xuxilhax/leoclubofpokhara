/**
 * Leo Club CMS — Authentication Library (Server Actions)
 * ----------------------------------------------------------------
 * Cookie-based session auth with bcrypt password hashing.
 * Designed so it can be swapped for NextAuth/Supabase later
 * without changing call sites.
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

/** Log in a user by email + password, set the session cookie */
export async function login(
  email: string,
  password: string,
  remember: boolean = false
): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user || !user.isActive) {
    return { success: false, error: "Invalid email or password." };
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { success: false, error: "Invalid email or password." };
  }
  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
  };

  const token = createSessionToken(sessionUser);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? SESSION_MAX_AGE : 60 * 60 * 24,
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      action: "LOGIN",
      module: "auth",
      details: "User logged in",
    },
  });

  return { success: true, user: sessionUser };
}

/** Log out the current user */
export async function logout(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: "LOGOUT",
        module: "auth",
        details: "User logged out",
      },
    });
  }
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Get the current logged-in user, or null */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSessionToken(token);
}

/** Require auth — throws if not authenticated */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

/** Record an audit log entry from a server action */
export async function recordAudit(
  user: SessionUser | null,
  action: string,
  module: string,
  details?: string,
  entityId?: string,
  entityName?: string
) {
  if (!user) return;
  await db.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      action,
      module,
      details,
      entityId,
      entityName,
    },
  });
}
