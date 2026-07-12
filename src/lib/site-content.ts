/**
 * Leo Club CMS — Site Content Store (Server Actions)
 * ----------------------------------------------------------------
 * Centralized key-value store for ALL editable site content.
 * Powers the Hero, About, Stats, Contact, Footer, and all
 * other sections that were previously hardcoded.
 *
 * Defaults live in site-content-defaults.ts (this file is "use server"
 * so it can only export async functions).
 */
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { DEFAULT_CONTENT } from "@/lib/site-content-defaults";

/**
 * Get all site content — merges DB values over defaults.
 */
export async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const rows = await db.siteSetting.findMany();
    const dbMap: Record<string, string> = {};
    for (const r of rows) dbMap[r.key] = r.value;
    return { ...DEFAULT_CONTENT, ...dbMap };
  } catch (err) {
    console.error("[getSiteContent] Error, using defaults:", err);
    return { ...DEFAULT_CONTENT };
  }
}

/**
 * Update a single setting — used by all admin editors.
 */
export async function updateSiteContent(key: string, value: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    revalidatePath("/");
    revalidatePath("/?admin=1");
    return { success: true };
  } catch (err) {
    console.error("[updateSiteContent] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to save" };
  }
}

/**
 * Update multiple settings at once.
 */
export async function updateManySiteContent(updates: Record<string, string>): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        db.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
    revalidatePath("/");
    revalidatePath("/?admin=1");
    return { success: true };
  } catch (err) {
    console.error("[updateManySiteContent] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to save" };
  }
}
