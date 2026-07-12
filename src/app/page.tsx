import { AdminProvider } from "@/components/admin/admin-context";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentUser } from "@/lib/auth";
import {
  getDashboardStats, getMembers, getEvents, getProjects,
  getBoardMembers, getNewsArticles, getGalleryImages, getApplications,
  getTestimonials, getSponsors, getDownloads, getContactMessages,
  getNotifications, getAuditLogs, getUsers, getSettings,
} from "@/lib/actions";
import { getPublicSiteData } from "@/lib/public-data";
import { PublicSite } from "@/components/public/public-site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Leo Club of Pokhara — Leadership · Experience · Opportunity",
    template: "%s · Leo Club of Pokhara",
  },
  description:
    "The official website of the Leo Club of Pokhara, Nepal — chartered on August 8, 1979 under the sponsorship of the Lions Club of Pokhara. Cultivating leadership, experience, and opportunity through service since 1979.",
  keywords: [
    "Leo Club of Pokhara", "Lions Club of Pokhara", "Leo Club Nepal",
    "Lions International", "Pokhara service club", "volunteer Nepal",
    "youth leadership Nepal", "Leadership Experience Opportunity",
  ],
  authors: [{ name: "Leo Club of Pokhara" }],
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  openGraph: {
    title: "Leo Club of Pokhara — Leadership · Experience · Opportunity",
    description:
      "Chartered August 8, 1979. Sponsored by the Lions Club of Pokhara. Cultivating leadership, experience, and opportunity through service since 1979.",
    url: "https://leoclubofpokhara.org.np",
    siteName: "Leo Club of Pokhara",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leo Club of Pokhara",
    description: "Chartered August 8, 1979. Leadership · Experience · Opportunity.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060B16" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Always fetch fresh data — CMS edits should appear instantly
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ admin?: string }>;
}) {
  const params = await searchParams;
  const isAdmin = params.admin === "1" || params.admin === "true";

  // ─── ADMIN MODE ────────────────────────────────────────────
  if (isAdmin) {
    const user = await getCurrentUser();

    const [
      stats, members, events, projects, board, news, gallery,
      applications, testimonials, sponsors, downloads, messages,
      notifications, auditLogs, users, settings,
    ] = await Promise.all([
      getDashboardStats(), getMembers(), getEvents(), getProjects(),
      getBoardMembers(), getNewsArticles(), getGalleryImages(), getApplications(),
      getTestimonials(), getSponsors(), getDownloads(), getContactMessages(),
      getNotifications(), getAuditLogs(), getUsers(), getSettings(),
    ]);

    const serialize = <T,>(obj: T): T => {
      if (obj === null || obj === undefined) return obj;
      if (obj instanceof Date) return obj.toISOString() as unknown as T;
      if (Array.isArray(obj)) return obj.map(serialize) as unknown as T;
      if (typeof obj === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(obj as Record<string, unknown>)) out[k] = serialize(v);
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

    const sessionUser = user
      ? { id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl }
      : null;

    return (
      <AdminProvider>
        <AdminShell data={data} initialUser={sessionUser} />
      </AdminProvider>
    );
  }

  // ─── PUBLIC SITE MODE ──────────────────────────────────────
  const publicData = await getPublicSiteData();
  return <PublicSite data={publicData} />;
}
