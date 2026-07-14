"use client";
/** Client-side API helper — uses fetch() to /api/admin instead of Server Actions */

export async function saveContent(updates: Record<string, string>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "saveContent", data: updates }) });
    return await res.json();
  } catch (err) { return { success: false, error: err instanceof Error ? err.message : "Network error" }; }
}
export async function createRecord(table: string, data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", table, data }) });
    return await res.json();
  } catch (err) { return { success: false, error: err instanceof Error ? err.message : "Network error" }; }
}
export async function updateRecord(table: string, id: string, data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update", table, id, data }) });
    return await res.json();
  } catch (err) { return { success: false, error: err instanceof Error ? err.message : "Network error" }; }
}
export async function deleteRecord(table: string, id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", table, id }) });
    return await res.json();
  } catch (err) { return { success: false, error: err instanceof Error ? err.message : "Network error" }; }
}

function fdGet(fd: FormData, key: string): string { return (fd.get(key) as string) || ""; }

export async function createNewsArticle(fd: FormData) {
  const title = fdGet(fd, "title");
  return createRecord("NewsArticle", { title, slug: fdGet(fd, "slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), excerpt: fdGet(fd, "excerpt") || null, content: fdGet(fd, "content") || "", category: fdGet(fd, "category") || "General", tags: fdGet(fd, "tags") || "", status: fdGet(fd, "status") || "DRAFT", isFeatured: fdGet(fd, "isFeatured") === "true", publishedAt: fdGet(fd, "status") === "PUBLISHED" ? new Date().toISOString() : null });
}
export async function updateNewsArticle(id: string, fd: FormData) {
  const title = fdGet(fd, "title");
  return updateRecord("NewsArticle", id, { title, slug: fdGet(fd, "slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), excerpt: fdGet(fd, "excerpt") || null, content: fdGet(fd, "content") || "", category: fdGet(fd, "category") || "General", tags: fdGet(fd, "tags") || "", status: fdGet(fd, "status"), isFeatured: fdGet(fd, "isFeatured") === "true" });
}
export async function deleteNewsArticle(id: string) { return deleteRecord("NewsArticle", id); }
export async function reviewApplication(id: string, status: string, note: string) { return updateRecord("MembershipApplication", id, { status, reviewNote: note, reviewedAt: new Date().toISOString() }); }
export async function createTestimonial(fd: FormData) { return createRecord("Testimonial", { quote: fdGet(fd, "quote"), author: fdGet(fd, "author"), role: fdGet(fd, "role"), category: fdGet(fd, "category") || "Member", isApproved: fdGet(fd, "isApproved") === "true", isFeatured: fdGet(fd, "isFeatured") === "true" }); }
export async function updateTestimonial(id: string, fd: FormData) { return updateRecord("Testimonial", id, { quote: fdGet(fd, "quote"), author: fdGet(fd, "author"), role: fdGet(fd, "role"), category: fdGet(fd, "category") || "Member", isApproved: fdGet(fd, "isApproved") === "true", isFeatured: fdGet(fd, "isFeatured") === "true" }); }
export async function deleteTestimonial(id: string) { return deleteRecord("Testimonial", id); }
export async function createSponsor(fd: FormData) { return createRecord("Sponsor", { name: fdGet(fd, "name"), websiteUrl: fdGet(fd, "websiteUrl") || null, category: fdGet(fd, "category") || "Partner", isActive: fdGet(fd, "isActive") !== "false" }); }
export async function updateSponsor(id: string, fd: FormData) { return updateRecord("Sponsor", id, { name: fdGet(fd, "name"), websiteUrl: fdGet(fd, "websiteUrl") || null, category: fdGet(fd, "category") || "Partner", isActive: fdGet(fd, "isActive") !== "false" }); }
export async function deleteSponsor(id: string) { return deleteRecord("Sponsor", id); }
export async function createDownload(fd: FormData) { return createRecord("Download", { title: fdGet(fd, "title"), description: fdGet(fd, "description") || null, fileUrl: fdGet(fd, "fileUrl") || `/downloads/${Date.now()}`, fileType: fdGet(fd, "fileType") || "pdf", category: fdGet(fd, "category") || "Document", version: fdGet(fd, "version") || "1.0", isPublished: fdGet(fd, "isPublished") !== "false" }); }
export async function deleteDownload(id: string) { return deleteRecord("Download", id); }
export async function markMessageRead(id: string) { return updateRecord("ContactMessage", id, { isRead: true }); }
export async function deleteContactMessage(id: string) { return deleteRecord("ContactMessage", id); }
