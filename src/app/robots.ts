import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalUrl("").replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/dashboard/"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
