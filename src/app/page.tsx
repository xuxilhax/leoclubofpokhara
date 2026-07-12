import { AdminProvider } from "@/components/admin/admin-context";
import { AdminShell } from "@/components/admin/admin-shell";
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
    // Safely fetch all dashboard data — if any DB call fails, fall back
    // to empty arrays so the dashboard still renders.
    const safeFetch = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
      try {
        return await fn();
      } catch (err) {
        console.error("[Admin data fetch error]", err);
        return fallback;
      }
    };

    const emptyStats = {
      members: 0, activeProjects: 0, upcomingEvents: 0, pendingApplications: 0,
      galleryImages: 0, publishedNews: 0, sponsors: 0, unreadNotifications: 0,
      visitors: 0, visitorChange: 0,
      recentAuditLogs: [], recentApplications: [], upcomingEventsList: [],
    };

    const [
      stats, members, events, projects, board, news, gallery,
      applications, testimonials, sponsors, downloads, messages,
      notifications, auditLogs, users, settings,
    ] = await Promise.all([
      safeFetch(() => getDashboardStats(), emptyStats as any),
      safeFetch(() => getMembers(), []),
      safeFetch(() => getEvents(), []),
      safeFetch(() => getProjects(), []),
      safeFetch(() => getBoardMembers(), []),
      safeFetch(() => getNewsArticles(), []),
      safeFetch(() => getGalleryImages(), []),
      safeFetch(() => getApplications(), []),
      safeFetch(() => getTestimonials(), []),
      safeFetch(() => getSponsors(), []),
      safeFetch(() => getDownloads(), []),
      safeFetch(() => getContactMessages(), []),
      safeFetch(() => getNotifications(), []),
      safeFetch(() => getAuditLogs(), []),
      safeFetch(() => getUsers(), []),
      safeFetch(() => getSettings(), {}),
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

    return (
      <AdminProvider>
        <AdminShell data={data} />
      </AdminProvider>
    );
  }

  // ─── PUBLIC SITE MODE ──────────────────────────────────────
  const publicData = await safeFetchPublic(() => getPublicSiteData());
  return <PublicSite data={publicData} />;
}

// Safe wrapper for public site data — returns fallback if DB fails
async function safeFetchPublic<T extends { boardMembers: any[]; projects: any[]; events: any[]; galleryImages: any[]; testimonials: any[]; sponsors: any[]; newsArticles: any[]; downloads: any[]; settings: Record<string, string>; stats: any }>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[Public data fetch error]", err);
    // Return safe fallback so the public site still renders
    return {
      boardMembers: [],
      projects: [],
      events: [],
      galleryImages: [],
      testimonials: [],
      sponsors: [],
      newsArticles: [],
      downloads: [],
      settings: {},
      stats: { members: 0, projects: 0, events: 0, yearsOfService: 46, beneficiaries: 0, volunteerHours: 0 },
    } as T;
  }
}
