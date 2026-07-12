/**
 * Leo Club CMS — Auth Helpers
 * ----------------------------------------------------------------
 * Pure functions and constants for auth. No bcrypt, no DB.
 * Session tokens are base64-encoded JSON (not cryptographically
 * signed — acceptable for internal use with HTTP-only cookies).
 */
import type { UserRole } from "@prisma/client";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
};

export const ROLE_HIERARCHY: UserRole[] = [
  "EDITOR",
  "TREASURER",
  "SECRETARY",
  "VICE_PRESIDENT",
  "PRESIDENT",
  "SUPER_ADMIN",
];

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  PRESIDENT: "President",
  VICE_PRESIDENT: "Vice President",
  SECRETARY: "Secretary",
  TREASURER: "Treasurer",
  EDITOR: "Editor",
};

export const PERMISSIONS = {
  "dashboard.view": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER", "EDITOR"],
  "members.view": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER", "EDITOR"],
  "members.edit": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY"],
  "members.delete": ["SUPER_ADMIN", "PRESIDENT", "SECRETARY"],
  "events.view": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER", "EDITOR"],
  "events.edit": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "EDITOR"],
  "events.delete": ["SUPER_ADMIN", "PRESIDENT"],
  "projects.view": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER", "EDITOR"],
  "projects.edit": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "EDITOR"],
  "projects.delete": ["SUPER_ADMIN", "PRESIDENT"],
  "board.view": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER", "EDITOR"],
  "board.edit": ["SUPER_ADMIN", "PRESIDENT", "SECRETARY"],
  "board.delete": ["SUPER_ADMIN", "PRESIDENT"],
  "news.view": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER", "EDITOR"],
  "news.edit": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "EDITOR"],
  "news.delete": ["SUPER_ADMIN", "PRESIDENT"],
  "news.publish": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT"],
  "applications.view": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY"],
  "applications.approve": ["SUPER_ADMIN", "PRESIDENT", "VICE_PRESIDENT", "SECRETARY"],
  "settings.edit": ["SUPER_ADMIN", "PRESIDENT"],
  "audit.view": ["SUPER_ADMIN", "PRESIDENT"],
  "users.manage": ["SUPER_ADMIN"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}

/** Create a session token — base64-encoded JSON (internal use only) */
export function createSessionToken(user: SessionUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
    ts: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

/** Decode a session token — returns null if invalid */
export function decodeSessionToken(token: string): SessionUser | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString());
    if (!payload.id || !payload.email || !payload.role) return null;
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role as UserRole,
      avatarUrl: payload.avatarUrl || null,
    };
  } catch {
    return null;
  }
}
