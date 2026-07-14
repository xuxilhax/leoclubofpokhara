import {
  getBoardMembers, getProjects, getEvents, getGalleryImages,
  getTestimonials, getSponsors, getNewsArticles, getDownloads, getSettings,
  getNavigationItems,
} from "@/lib/supabase-db";
import { DEFAULT_CONTENT } from "@/lib/site-content-defaults";

export type PublicData = {
  content: Record<string, string>;
  settings: Record<string, string>;
  boardMembers: any[];
  projects: any[];
  events: any[];
  galleryImages: any[];
  testimonials: any[];
  sponsors: any[];
  newsArticles: any[];
  downloads: any[];
  navigationItems: any[];
  stats: { members: number; projects: number; events: number; yearsOfService: number; beneficiaries: number; volunteerHours: number; };
};

export async function getPublicSiteData(): Promise<PublicData> {
  try {
    const [settings, boardMembers, projects, events, galleryImages, testimonials, sponsors, newsArticles, downloads, navigationItems] = await Promise.all([
      getSettings(), getBoardMembers(), getProjects(), getEvents(), getGalleryImages(),
      getTestimonials(), getSponsors(), getNewsArticles(), getDownloads(), getNavigationItems(),
    ]);
    const content = { ...DEFAULT_CONTENT, ...settings };
    const totalBeneficiaries = projects.reduce((s: number, p: any) => s + (p.beneficiaries || 0), 0);
    const totalVolunteers = projects.reduce((s: number, p: any) => s + (p.volunteers || 0), 0);
    return {
      content, settings, boardMembers, projects, events, galleryImages, testimonials, sponsors, newsArticles, downloads,
      navigationItems: (navigationItems || []).filter((n: any) => n.isActive).map((n: any) => ({ label: n.label, href: n.href })),
      stats: { members: 85, projects: projects.length, events: events.filter((e: any) => new Date(e.startDate) >= new Date()).length, yearsOfService: new Date().getFullYear() - 1979, beneficiaries: totalBeneficiaries, volunteerHours: totalVolunteers * 24 },
    };
  } catch (err) {
    console.error("[getPublicSiteData] Error:", err);
    return { content: { ...DEFAULT_CONTENT }, settings: {}, boardMembers: [], projects: [], events: [], galleryImages: [], testimonials: [], sponsors: [], newsArticles: [], downloads: [], navigationItems: [], stats: { members: 0, projects: 0, events: 0, yearsOfService: 46, beneficiaries: 0, volunteerHours: 0 } };
  }
}
