/**
 * Leo Club CMS — Client-callable auth server actions.
 * Thin wrappers around the hardcoded auth library.
 */
"use server";

import { login, logout, type LoginResult } from "@/lib/auth";

export async function loginAction(
  email: string,
  password: string,
  remember: boolean
): Promise<LoginResult> {
  return login(email, password, remember);
}

export async function logoutAction(): Promise<{ success: boolean }> {
  return logout();
}
