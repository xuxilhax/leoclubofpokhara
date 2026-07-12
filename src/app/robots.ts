import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/?admin=1", "/api/"],
      },
    ],
    sitemap: "https://leoclubofpokhara.org.np/sitemap.xml",
    host: "https://leoclubofpokhara.org.np",
  };
}
