/**
 * Supabase REST API client — all DB operations via HTTPS
 */
const SUPABASE_URL = "https://pbvxnimctxwmpxlqkcsm.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidnhuaW1jdHh3bXB4bHFrY3NtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg4NDc4OCwiZXhwIjoyMDk5NDYwNzg4fQ.0LaWkyfs8N2k3NCeD0_3OCPdSGPM6HXpHTrO4USJI14";

const headers: Record<string, string> = {
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation",
};

const baseUrl = `${SUPABASE_URL}/rest/v1`;

export async function supabaseFetch<T = any>(table: string, options: {
  select?: string; filter?: string; order?: string; limit?: number; method?: string; body?: any;
} = {}): Promise<T> {
  const { select = "*", filter, order, limit, method = "GET", body } = options;
  let url = `${baseUrl}/${table}?select=${encodeURIComponent(select)}`;
  if (filter) url += `&${filter}`;
  if (order) url += `&order=${encodeURIComponent(order)}`;
  if (limit) url += `&limit=${limit}`;

  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) { const e = await res.text(); throw new Error(`Supabase: ${e}`); }
  if (method === "DELETE") return [] as T;
  return res.json();
}

// READ
export const getDashboardStats = async () => {
  const [members, projects, events, apps, gallery, news, sponsors, notifs] = await Promise.all([
    supabaseFetch("Member", { filter: "status=eq.ACTIVE", select: "id" }),
    supabaseFetch("Project", { filter: "isPublished=eq.true", select: "id" }),
    supabaseFetch("Event", { filter: `startDate=gte.${new Date().toISOString()}`, select: "id" }),
    supabaseFetch("MembershipApplication", { filter: "status=eq.PENDING", select: "id" }),
    supabaseFetch("GalleryImage", { select: "id" }),
    supabaseFetch("NewsArticle", { filter: "status=eq.PUBLISHED", select: "id" }),
    supabaseFetch("Sponsor", { filter: "isActive=eq.true", select: "id" }),
    supabaseFetch("Notification", { filter: "isRead=eq.false", select: "id" }),
  ]);
  return { members: members.length, activeProjects: projects.length, upcomingEvents: events.length, pendingApplications: apps.length, galleryImages: gallery.length, publishedNews: news.length, sponsors: sponsors.length, unreadNotifications: notifs.length, visitors: 18432, visitorChange: 12.5, recentAuditLogs: [], recentApplications: [], upcomingEventsList: [] };
};
export const getMembers = () => supabaseFetch("Member", { order: "createdAt.desc" });
export const getEvents = () => supabaseFetch("Event", { order: "startDate.desc" });
export const getProjects = () => supabaseFetch("Project", { order: "createdAt.desc" });
export const getBoardMembers = () => supabaseFetch("BoardMember", { order: "order.asc" });
export const getNewsArticles = () => supabaseFetch("NewsArticle", { order: "createdAt.desc" });
export const getGalleryImages = () => supabaseFetch("GalleryImage", { order: "order.asc" });
export const getApplications = () => supabaseFetch("MembershipApplication", { order: "createdAt.desc" });
export const getTestimonials = () => supabaseFetch("Testimonial", { order: "createdAt.desc" });
export const getSponsors = () => supabaseFetch("Sponsor", { order: "order.asc" });
export const getDownloads = () => supabaseFetch("Download", { order: "createdAt.desc" });
export const getContactMessages = () => supabaseFetch("ContactMessage", { order: "createdAt.desc" });
export const getNotifications = () => supabaseFetch("Notification", { order: "createdAt.desc", limit: 30 });
export const getAuditLogs = () => supabaseFetch("AuditLog", { order: "createdAt.desc", limit: 100 });
export const getUsers = () => supabaseFetch("User", { select: "id,email,name,role,isActive,lastLoginAt,createdAt", order: "createdAt.asc" });
export const getNavigationItems = () => supabaseFetch("NavigationItem", { order: "order.asc" });
export const getAnnouncements = () => supabaseFetch("Announcement", { order: "createdAt.desc" });
export const getSettings = async () => {
  const rows = await supabaseFetch("SiteSetting");
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
};

// WRITE
export const createMember = (d: any) => supabaseFetch("Member", { method: "POST", body: d });
export const updateMember = (id: string, d: any) => supabaseFetch("Member", { method: "PATCH", filter: `id=eq.${id}`, body: d });
export const deleteMember = (id: string) => supabaseFetch("Member", { method: "DELETE", filter: `id=eq.${id}` });
export const createEvent = (d: any) => supabaseFetch("Event", { method: "POST", body: d });
export const updateEvent = (id: string, d: any) => supabaseFetch("Event", { method: "PATCH", filter: `id=eq.${id}`, body: d });
export const deleteEvent = (id: string) => supabaseFetch("Event", { method: "DELETE", filter: `id=eq.${id}` });
export const createProject = (d: any) => supabaseFetch("Project", { method: "POST", body: d });
export const updateProject = (id: string, d: any) => supabaseFetch("Project", { method: "PATCH", filter: `id=eq.${id}`, body: d });
export const deleteProject = (id: string) => supabaseFetch("Project", { method: "DELETE", filter: `id=eq.${id}` });
export const createBoardMember = async (d: any) => { const c = await getBoardMembers(); return supabaseFetch("BoardMember", { method: "POST", body: { ...d, order: c.length } }); };
export const updateBoardMember = (id: string, d: any) => supabaseFetch("BoardMember", { method: "PATCH", filter: `id=eq.${id}`, body: d });
export const deleteBoardMember = (id: string) => supabaseFetch("BoardMember", { method: "DELETE", filter: `id=eq.${id}` });
export const createNewsArticle = (d: any) => supabaseFetch("NewsArticle", { method: "POST", body: d });
export const updateNewsArticle = (id: string, d: any) => supabaseFetch("NewsArticle", { method: "PATCH", filter: `id=eq.${id}`, body: d });
export const deleteNewsArticle = (id: string) => supabaseFetch("NewsArticle", { method: "DELETE", filter: `id=eq.${id}` });
export const createGalleryImage = (d: any) => supabaseFetch("GalleryImage", { method: "POST", body: d });
export const deleteGalleryImage = (id: string) => supabaseFetch("GalleryImage", { method: "DELETE", filter: `id=eq.${id}` });
export const createTestimonial = (d: any) => supabaseFetch("Testimonial", { method: "POST", body: d });
export const updateTestimonial = (id: string, d: any) => supabaseFetch("Testimonial", { method: "PATCH", filter: `id=eq.${id}`, body: d });
export const deleteTestimonial = (id: string) => supabaseFetch("Testimonial", { method: "DELETE", filter: `id=eq.${id}` });
export const createSponsor = async (d: any) => { const c = await getSponsors(); return supabaseFetch("Sponsor", { method: "POST", body: { ...d, order: c.length } }); };
export const updateSponsor = (id: string, d: any) => supabaseFetch("Sponsor", { method: "PATCH", filter: `id=eq.${id}`, body: d });
export const deleteSponsor = (id: string) => supabaseFetch("Sponsor", { method: "DELETE", filter: `id=eq.${id}` });
export const createDownload = (d: any) => supabaseFetch("Download", { method: "POST", body: d });
export const deleteDownload = (id: string) => supabaseFetch("Download", { method: "DELETE", filter: `id=eq.${id}` });
export const createNavigationItem = async (d: any) => { const c = await getNavigationItems(); return supabaseFetch("NavigationItem", { method: "POST", body: { ...d, order: c.length } }); };
export const deleteNavigationItem = (id: string) => supabaseFetch("NavigationItem", { method: "DELETE", filter: `id=eq.${id}` });
export const createAnnouncement = (d: any) => supabaseFetch("Announcement", { method: "POST", body: d });
export const deleteAnnouncement = (id: string) => supabaseFetch("Announcement", { method: "DELETE", filter: `id=eq.${id}` });
export const markNotificationRead = (id: string) => supabaseFetch("Notification", { method: "PATCH", filter: `id=eq.${id}`, body: { isRead: true } });
export const markAllNotificationsRead = () => supabaseFetch("Notification", { method: "PATCH", filter: "isRead=eq.false", body: { isRead: true } });
export const markMessageRead = (id: string) => supabaseFetch("ContactMessage", { method: "PATCH", filter: `id=eq.${id}`, body: { isRead: true } });
export const deleteContactMessage = (id: string) => supabaseFetch("ContactMessage", { method: "DELETE", filter: `id=eq.${id}` });
export const reviewApplication = (id: string, status: string, note: string) => supabaseFetch("MembershipApplication", { method: "PATCH", filter: `id=eq.${id}`, body: { status, reviewNote: note, reviewedAt: new Date().toISOString() } });
export async function updateSiteContent(key: string, value: string) {
  const existing = await supabaseFetch("SiteSetting", { filter: `key=eq.${key}`, select: "id" });
  if (existing.length > 0) return supabaseFetch("SiteSetting", { method: "PATCH", filter: `key=eq.${key}`, body: { value } });
  return supabaseFetch("SiteSetting", { method: "POST", body: { key, value } });
}
export async function updateManySiteContent(updates: Record<string, string>) {
  for (const [k, v] of Object.entries(updates)) await updateSiteContent(k, v);
  return { success: true };
}
