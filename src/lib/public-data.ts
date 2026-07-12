/**
 * Leo Club CMS — Public Site Data Layer
 * ----------------------------------------------------------------
 * Fetches all public-facing content from the database.
 * This is the bridge between the CMS (Phase 2) and the public
 * website (Phase 1) — CMS edits are reflected instantly here.
 */
import { db } from "@/lib/db";
import { siteConfig as fallbackConfig } from "@/lib/site-config";
import { getSiteContent } from "@/lib/site-content";

export type PublicStats = {
  members: number;
  projects: number;
  events: number;
  yearsOfService: number;
  beneficiaries: number;
  volunteerHours: number;
};

export type PublicData = {
  content: Record<string, string>;
  settings: Record<string, string>;
  boardMembers: Awaited<ReturnType<typeof db.boardMember.findMany>>;
  projects: Awaited<ReturnType<typeof db.project.findMany>>;
  events: Awaited<ReturnType<typeof db.event.findMany>>;
  galleryImages: Awaited<ReturnType<typeof db.galleryImage.findMany>>;
  testimonials: Awaited<ReturnType<typeof db.testimonial.findMany>>;
  sponsors: Awaited<ReturnType<typeof db.sponsor.findMany>>;
  newsArticles: Awaited<ReturnType<typeof db.newsArticle.findMany>>;
  downloads: Awaited<ReturnType<typeof db.download.findMany>>;
  stats: PublicStats;
};

/** Fetch all data needed to render the public site */
export async function getPublicSiteData(): Promise<PublicData> {
  const [
    content,
    settingsRows,
    boardMembers,
    projects,
    events,
    galleryImages,
    testimonials,
    sponsors,
    newsArticles,
    downloads,
    memberCount,
    projectCount,
    eventCount,
  ] = await Promise.all([
    getSiteContent(),
    db.siteSetting.findMany(),
    db.boardMember.findMany({
      where: { isArchived: false },
      orderBy: { order: "asc" },
    }),
    db.project.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    }),
    db.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: "asc" },
    }),
    db.galleryImage.findMany({
      orderBy: { order: "asc" },
      take: 12,
    }),
    db.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { order: "asc" },
    }),
    db.sponsor.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    db.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 6,
    }),
    db.download.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    }),
    db.member.count({ where: { status: "ACTIVE" } }),
    db.project.count({ where: { isPublished: true } }),
    db.event.count({ where: { startDate: { gte: new Date() } } }),
  ]);

  // Convert settings to a key-value map
  const settings: Record<string, string> = {};
  for (const s of settingsRows) settings[s.key] = s.value;

  // Calculate stats
  const charterYear = 1979;
  const currentYear = new Date().getFullYear();
  const totalBeneficiaries = projects.reduce((sum, p) => sum + (p.beneficiaries || 0), 0);
  const totalVolunteers = projects.reduce((sum, p) => sum + (p.volunteers || 0), 0);

  return {
    content,
    settings,
    boardMembers,
    projects,
    events,
    galleryImages,
    testimonials,
    sponsors,
    newsArticles,
    downloads,
    stats: {
      members: memberCount,
      projects: projectCount,
      events: eventCount,
      yearsOfService: currentYear - charterYear,
      beneficiaries: totalBeneficiaries,
      volunteerHours: totalVolunteers * 24,
    },
  };
}
