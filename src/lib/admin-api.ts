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

// Members
export async function createMember(fd: FormData) {
  return createRecord("Member", { memberId: fdGet(fd, "memberId"), name: fdGet(fd, "name"), email: fdGet(fd, "email"), phone: fdGet(fd, "phone") || null, position: fdGet(fd, "position") || null, joinDate: new Date(fdGet(fd, "joinDate")).toISOString(), status: fdGet(fd, "status"), membershipType: fdGet(fd, "membershipType"), notes: fdGet(fd, "notes") || null, address: fdGet(fd, "address") || null });
}
export async function updateMember(id: string, fd: FormData) {
  return updateRecord("Member", id, { name: fdGet(fd, "name"), email: fdGet(fd, "email"), phone: fdGet(fd, "phone") || null, position: fdGet(fd, "position") || null, memberId: fdGet(fd, "memberId"), joinDate: new Date(fdGet(fd, "joinDate")).toISOString(), status: fdGet(fd, "status"), membershipType: fdGet(fd, "membershipType"), notes: fdGet(fd, "notes") || null, address: fdGet(fd, "address") || null });
}
export async function deleteMember(id: string) { return deleteRecord("Member", id); }

// Board Members
export async function createBoardMember(fd: FormData) {
  return createRecord("BoardMember", { name: fdGet(fd, "name"), position: fdGet(fd, "position"), bio: fdGet(fd, "bio"), email: fdGet(fd, "email") || null, phone: fdGet(fd, "phone") || null, photoUrl: fdGet(fd, "photoUrl") || null, boardYear: fdGet(fd, "boardYear") || "2025-2026" });
}
export async function updateBoardMember(id: string, fd: FormData) {
  return updateRecord("BoardMember", id, { name: fdGet(fd, "name"), position: fdGet(fd, "position"), bio: fdGet(fd, "bio"), email: fdGet(fd, "email") || null, phone: fdGet(fd, "phone") || null, photoUrl: fdGet(fd, "photoUrl") || null, boardYear: fdGet(fd, "boardYear") || "2025-2026" });
}
export async function deleteBoardMember(id: string) { return deleteRecord("BoardMember", id); }
export async function archiveBoardMember(id: string) { return updateRecord("BoardMember", id, { isArchived: true }); }

// Events
export async function createEvent(fd: FormData) {
  return createRecord("Event", { title: fdGet(fd, "title"), description: fdGet(fd, "description"), category: fdGet(fd, "category") || "General", startDate: new Date(fdGet(fd, "startDate")).toISOString(), endDate: fdGet(fd, "endDate") ? new Date(fdGet(fd, "endDate")).toISOString() : null, location: fdGet(fd, "location"), registrationLimit: parseInt(fdGet(fd, "registrationLimit") || "0"), isFeatured: fdGet(fd, "isFeatured") === "true", isPublished: fdGet(fd, "isPublished") !== "false" });
}
export async function updateEvent(id: string, fd: FormData) {
  return updateRecord("Event", id, { title: fdGet(fd, "title"), description: fdGet(fd, "description"), category: fdGet(fd, "category") || "General", startDate: new Date(fdGet(fd, "startDate")).toISOString(), endDate: fdGet(fd, "endDate") ? new Date(fdGet(fd, "endDate")).toISOString() : null, location: fdGet(fd, "location"), registrationLimit: parseInt(fdGet(fd, "registrationLimit") || "0"), isFeatured: fdGet(fd, "isFeatured") === "true", isPublished: fdGet(fd, "isPublished") !== "false" });
}
export async function deleteEvent(id: string) { return deleteRecord("Event", id); }
export async function duplicateEvent(id: string) {
  const res = await fetch("/api/admin?table=Event");
  const data = await res.json();
  const event = (data.data || []).find((e: any) => e.id === id);
  if (!event) return { success: false };
  const { id: _, createdAt: __, updatedAt: ___, ...eventData } = event;
  return createRecord("Event", { ...eventData, title: `${event.title} (Copy)`, isPublished: false });
}
export async function toggleEventPublish(id: string) {
  const res = await fetch("/api/admin?table=Event");
  const data = await res.json();
  const event = (data.data || []).find((e: any) => e.id === id);
  if (!event) return { success: false };
  return updateRecord("Event", id, { isPublished: !event.isPublished });
}

// Projects
export async function createProject(fd: FormData) {
  return createRecord("Project", { title: fdGet(fd, "title"), description: fdGet(fd, "description"), category: fdGet(fd, "category") || "Service", coverImageUrl: fdGet(fd, "coverImageUrl") || null, startDate: new Date(fdGet(fd, "startDate")).toISOString(), endDate: fdGet(fd, "endDate") ? new Date(fdGet(fd, "endDate")).toISOString() : null, location: fdGet(fd, "location"), budget: parseFloat(fdGet(fd, "budget") || "0"), volunteers: parseInt(fdGet(fd, "volunteers") || "0"), beneficiaries: parseInt(fdGet(fd, "beneficiaries") || "0"), impact: fdGet(fd, "impact") || null, isFeatured: fdGet(fd, "isFeatured") === "true", isPublished: fdGet(fd, "isPublished") !== "false" });
}
export async function updateProject(id: string, fd: FormData) {
  return updateRecord("Project", id, { title: fdGet(fd, "title"), description: fdGet(fd, "description"), category: fdGet(fd, "category") || "Service", coverImageUrl: fdGet(fd, "coverImageUrl") || null, startDate: new Date(fdGet(fd, "startDate")).toISOString(), endDate: fdGet(fd, "endDate") ? new Date(fdGet(fd, "endDate")).toISOString() : null, location: fdGet(fd, "location"), budget: parseFloat(fdGet(fd, "budget") || "0"), volunteers: parseInt(fdGet(fd, "volunteers") || "0"), beneficiaries: parseInt(fdGet(fd, "beneficiaries") || "0"), impact: fdGet(fd, "impact") || null, isFeatured: fdGet(fd, "isFeatured") === "true", isPublished: fdGet(fd, "isPublished") !== "false" });
}
export async function deleteProject(id: string) { return deleteRecord("Project", id); }

// News
export async function createNewsArticle(fd: FormData) {
  const title = fdGet(fd, "title");
  return createRecord("NewsArticle", { title, slug: fdGet(fd, "slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), excerpt: fdGet(fd, "excerpt") || null, content: fdGet(fd, "content") || "", category: fdGet(fd, "category") || "General", tags: fdGet(fd, "tags") || "", status: fdGet(fd, "status") || "DRAFT", isFeatured: fdGet(fd, "isFeatured") === "true", publishedAt: fdGet(fd, "status") === "PUBLISHED" ? new Date().toISOString() : null });
}
export async function updateNewsArticle(id: string, fd: FormData) {
  const title = fdGet(fd, "title");
  return updateRecord("NewsArticle", id, { title, slug: fdGet(fd, "slug") || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), excerpt: fdGet(fd, "excerpt") || null, content: fdGet(fd, "content") || "", category: fdGet(fd, "category") || "General", tags: fdGet(fd, "tags") || "", status: fdGet(fd, "status"), isFeatured: fdGet(fd, "isFeatured") === "true" });
}
export async function deleteNewsArticle(id: string) { return deleteRecord("NewsArticle", id); }

// Applications
export async function reviewApplication(id: string, status: string, note: string) { return updateRecord("MembershipApplication", id, { status, reviewNote: note, reviewedAt: new Date().toISOString() }); }

// Testimonials
export async function createTestimonial(fd: FormData) { return createRecord("Testimonial", { quote: fdGet(fd, "quote"), author: fdGet(fd, "author"), role: fdGet(fd, "role"), category: fdGet(fd, "category") || "Member", isApproved: fdGet(fd, "isApproved") === "true", isFeatured: fdGet(fd, "isFeatured") === "true" }); }
export async function updateTestimonial(id: string, fd: FormData) { return updateRecord("Testimonial", id, { quote: fdGet(fd, "quote"), author: fdGet(fd, "author"), role: fdGet(fd, "role"), category: fdGet(fd, "category") || "Member", isApproved: fdGet(fd, "isApproved") === "true", isFeatured: fdGet(fd, "isFeatured") === "true" }); }
export async function deleteTestimonial(id: string) { return deleteRecord("Testimonial", id); }

// Sponsors
export async function createSponsor(fd: FormData) { return createRecord("Sponsor", { name: fdGet(fd, "name"), websiteUrl: fdGet(fd, "websiteUrl") || null, category: fdGet(fd, "category") || "Partner", isActive: fdGet(fd, "isActive") !== "false" }); }
export async function updateSponsor(id: string, fd: FormData) { return updateRecord("Sponsor", id, { name: fdGet(fd, "name"), websiteUrl: fdGet(fd, "websiteUrl") || null, category: fdGet(fd, "category") || "Partner", isActive: fdGet(fd, "isActive") !== "false" }); }
export async function deleteSponsor(id: string) { return deleteRecord("Sponsor", id); }

// Downloads
export async function createDownload(fd: FormData) { return createRecord("Download", { title: fdGet(fd, "title"), description: fdGet(fd, "description") || null, fileUrl: fdGet(fd, "fileUrl") || `/downloads/${Date.now()}`, fileType: fdGet(fd, "fileType") || "pdf", category: fdGet(fd, "category") || "Document", version: fdGet(fd, "version") || "1.0", isPublished: fdGet(fd, "isPublished") !== "false" }); }
export async function deleteDownload(id: string) { return deleteRecord("Download", id); }

// Messages
export async function markMessageRead(id: string) { return updateRecord("ContactMessage", id, { isRead: true }); }
export async function deleteContactMessage(id: string) { return deleteRecord("ContactMessage", id); }

// Navigation
export async function createNavigationItem(fd: FormData) { return createRecord("NavigationItem", { label: fdGet(fd, "label"), href: fdGet(fd, "href"), isActive: fdGet(fd, "isActive") !== "false" }); }
export async function deleteNavigationItem(id: string) { return deleteRecord("NavigationItem", id); }
export async function fetchRecords(table: string) {
  try {
    const res = await fetch(`/api/admin?table=${table}`);
    const result = await res.json();
    return result.data || [];
  } catch { return []; }
}
