import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getCanonicalUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getCanonicalUrl("").replace(/\/$/, "");

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base + "/", lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    {
      url: base + "/wall-of-wins",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    { url: base + "/yearbook", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    {
      url: base + "/resources",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: base + "/leaderboards",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: base + "/login", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  let yearbookUrls: MetadataRoute.Sitemap = [];
  try {
    const pages = await prisma.yearbookPage.findMany({
      where: { status: "APPROVED", publishedAt: { not: null }, slug: { not: null } },
      select: { slug: true, updatedAt: true },
    });
    yearbookUrls = pages.map((p) => ({
      url: `${base}/yearbook/${p.slug!}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB may not be available at build time
  }

  return [...staticEntries, ...yearbookUrls];
}
