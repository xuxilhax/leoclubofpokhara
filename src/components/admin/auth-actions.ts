/**
 * Leo Club CMS — Client-callable auth server actions.
 * ----------------------------------------------------------------
 * Thin wrappers around the auth library that are safe to call
 * from client components. These add a final try/catch so no
 * unhandled error ever reaches the client.
 */
"use server";

import { login, logout, getAuthDebugInfo, type LoginResult } from "@/lib/auth";

export async function loginAction(
  email: string,
  password: string,
  remember: boolean
): Promise<LoginResult> {
  try {
    return await login(email, password, remember);
  } catch (err) {
    // This should never happen — login() already catches everything.
    // But if it does, we return a safe structured error instead of
    // letting Next.js show "Something went wrong".
    console.error("[auth-actions] loginAction unhandled error:", err);
    return {
      success: false,
      errorType: "INTERNAL",
      error:
        process.env.NODE_ENV === "development"
          ? `Unhandled: ${err instanceof Error ? err.message : String(err)}`
          : "An unexpected error occurred. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    return await logout();
  } catch (err) {
    console.error("[auth-actions] logoutAction unhandled error:", err);
    return { success: false };
  }
}

/**
 * DEBUG MODE — call this from the client to get diagnostic info.
 * Only returns detailed info when NODE_ENV === "development".
 */
export async function getAuthDebugAction() {
  return getAuthDebugInfo();
}
