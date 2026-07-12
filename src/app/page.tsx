import { AdminProvider, type AdminUser } from "@/components/admin/admin-context";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getDashboardStats, getMembers, getEvents, getProjects,
  getBoardMembers, getNewsArticles, getGalleryImages, getApplications,
  getTestimonials, getSponsors, getDownloads, getContactMessages,
  getNotifications, getAuditLogs, getUsers, getSettings,
} from "@/lib/actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin Dashboard", template: "%s · Leo Club CMS" },
  description: "Content Management System for the Leo Club of Pokhara",
  robots: { index: false, follow: false },
};

// Prevent any caching — dashboard needs fresh data
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Try to get the current user — null if not logged in
  const user = await getCurrentUser();

  // Always fetch data (even if no user) so it's ready after login
  const [
    stats, members, events, projects, board, news, gallery,
    applications, testimonials, sponsors, downloads, messages,
    notifications, auditLogs, users, settings,
  ] = await Promise.all([
    getDashboardStats(),
    getMembers(),
    getEvents(),
    getProjects(),
    getBoardMembers(),
    getNewsArticles(),
    getGalleryImages(),
    getApplications(),
    getTestimonials(),
    getSponsors(),
    getDownloads(),
    getContactMessages(),
    getNotifications(),
    getAuditLogs(),
    getUsers(),
    getSettings(),
  ]);

  // Convert Date objects to ISO strings for serialization
  const serialize = <T,>(obj: T): T => {
    if (obj === null || obj === undefined) return obj;
    if (obj instanceof Date) return obj.toISOString() as unknown as T;
    if (Array.isArray(obj)) return obj.map(serialize) as unknown as T;
    if (typeof obj === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        out[k] = serialize(v);
      }
      return out as unknown as T;
    }
    return obj;
  };

  const data = {
    stats: {
      ...stats,
      recentAuditLogs: serialize(stats.recentAuditLogs),
      recentApplications: serialize(stats.recentApplications),
      upcomingEventsList: serialize(stats.upcomingEventsList),
    },
    members: serialize(members),
    events: serialize(events),
    projects: serialize(projects),
    board: serialize(board),
    news: serialize(news),
    gallery: serialize(gallery),
    applications: serialize(applications),
    testimonials: serialize(testimonials),
    sponsors: serialize(sponsors),
    downloads: serialize(downloads),
    messages: serialize(messages),
    notifications: serialize(notifications),
    auditLogs: serialize(auditLogs),
    users: serialize(users),
    settings,
  };

  const sessionUser: AdminUser | null = user
    ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      }
    : null;

  return (
    <AdminProvider>
      <AdminShell
        data={data}
        initialUser={sessionUser}
      />
    </AdminProvider>
  );
}
