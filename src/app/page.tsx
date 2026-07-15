import { AdminProvider } from "@/components/admin/admin-context";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  getDashboardStats, getEvents, getProjects, getBoardMembers,
  getNewsArticles, getGalleryImages, getTestimonials, getSponsors, getSettings,
} from "@/lib/supabase-db";
import { getPublicSiteData } from "@/lib/public-data";
import { PublicSite } from "@/components/public/public-site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Leo Club of Pokhara — Leadership · Experience · Opportunity", template: "%s · Leo Club of Pokhara" },
  description: "The official website of the Leo Club of Pokhara, Nepal — chartered on August 8, 1979.",
  icons: { icon: "/favicon-32.png", apple: "/apple-touch-icon.png" },
};

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ admin?: string }> }) {
  const params = await searchParams;
  const isAdmin = params.admin === "1" || params.admin === "true";

  if (isAdmin) {
    const safeFetch = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
      try { return await fn(); } catch { return fallback; }
    };

    const [stats, events, projects, board, news, gallery, testimonials, sponsors, settings] = await Promise.all([
      safeFetch(() => getDashboardStats(), { members: 0, activeProjects: 0, upcomingEvents: 0, pendingApplications: 0, galleryImages: 0, publishedNews: 0, sponsors: 0, unreadNotifications: 0, visitors: 0, visitorChange: 0, recentAuditLogs: [], recentApplications: [], upcomingEventsList: [] } as any),
      safeFetch(() => getEvents(), []),
      safeFetch(() => getProjects(), []),
      safeFetch(() => getBoardMembers(), []),
      safeFetch(() => getNewsArticles(), []),
      safeFetch(() => getGalleryImages(), []),
      safeFetch(() => getTestimonials(), []),
      safeFetch(() => getSponsors(), []),
      safeFetch(() => getSettings(), {}),
    ]);

    return (
      <AdminProvider>
        <AdminShell data={{ stats, events, projects, board, news, gallery, testimonials, sponsors, settings }} />
      </AdminProvider>
    );
  }

  const publicData = await getPublicSiteData();
  return <PublicSite data={publicData} />;
}
