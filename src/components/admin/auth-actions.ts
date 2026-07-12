"use server";

import { login, logout } from "@/lib/auth";

export async function loginAction(email: string, password: string, remember: boolean) {
  return login(email, password, remember);
}

export async function logoutAction() {
  return logout();
}
