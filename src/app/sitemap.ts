import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://leoclubofpokhara.org.np";
  const sections = ["", "#about", "#projects", "#events", "#gallery", "#board", "#membership", "#contact"];
  const now = new Date();

  return sections.map((section) => ({
    url: `${baseUrl}/${section}`,
    lastModified: now,
    changeFrequency: section === "" ? "daily" : "weekly",
    priority: section === "" ? 1.0 : 0.8,
  }));
}
