/**
 * Leo Club CMS — Site-wide Search
 * ----------------------------------------------------------------
 * Searches across news, events, projects, board members, and downloads.
 * Returns ranked results with type badges.
 */
import { db } from "@/lib/db";

export type SearchResult = {
  id: string;
  type: "news" | "event" | "project" | "member" | "download" | "page";
  title: string;
  description: string;
  url: string;
  date?: Date;
  category?: string;
};

export async function searchSite(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim();

  const [news, events, projects, members, downloads] = await Promise.all([
    db.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { content: { contains: q } },
          { tags: { contains: q } },
        ],
      },
      take: 10,
      orderBy: { publishedAt: "desc" },
    }),
    db.event.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { location: { contains: q } },
        ],
      },
      take: 10,
      orderBy: { startDate: "desc" },
    }),
    db.project.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { location: { contains: q } },
          { category: { contains: q } },
        ],
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    }),
    db.boardMember.findMany({
      where: {
        isArchived: false,
        OR: [
          { name: { contains: q } },
          { position: { contains: q } },
          { bio: { contains: q } },
        ],
      },
      take: 5,
    }),
    db.download.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
        ],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const results: SearchResult[] = [];

  for (const n of news) {
    results.push({
      id: n.id,
      type: "news",
      title: n.title,
      description: n.excerpt || n.content.substring(0, 150) || "",
      url: `/#news`,
      date: n.publishedAt || undefined,
      category: n.category,
    });
  }

  for (const e of events) {
    results.push({
      id: e.id,
      type: "event",
      title: e.title,
      description: e.description.substring(0, 150),
      url: `/#events`,
      date: e.startDate,
      category: e.category,
    });
  }

  for (const p of projects) {
    results.push({
      id: p.id,
      type: "project",
      title: p.title,
      description: p.description.substring(0, 150),
      url: `/#projects`,
      category: p.category,
    });
  }

  for (const m of members) {
    results.push({
      id: m.id,
      type: "member",
      title: m.name,
      description: m.position,
      url: `/#board`,
    });
  }

  for (const d of downloads) {
    results.push({
      id: d.id,
      type: "download",
      title: d.title,
      description: d.description || d.category,
      url: `/#downloads`,
      category: d.category,
    });
  }

  return results;
}
