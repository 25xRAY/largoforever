import type { Metadata } from "next";
import { Suspense } from "react";
import { getCanonicalUrl } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/seo/JsonLd";
import { WallOfWinsPageClient } from "./WallOfWinsPageClient";

const WALL_TITLE = "Wall of Wins — Largo Lions Class of 2026 Scholarships & Acceptances";

interface PublicStatsPayload {
  totalScholarships: number;
  collegeAcceptances: number;
  fullRides: number;
}

function formatScholarshipsForDescription(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Math.round(n)}`;
}

async function fetchPublicStats(): Promise<PublicStatsPayload> {
  const url = getCanonicalUrl("/api/public/stats");
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return { totalScholarships: 0, collegeAcceptances: 0, fullRides: 0 };
    return res.json() as Promise<PublicStatsPayload>;
  } catch {
    return { totalScholarships: 0, collegeAcceptances: 0, fullRides: 0 };
  }
}

function buildWallDescription(stats: PublicStatsPayload): string {
  const dollars = formatScholarshipsForDescription(stats.totalScholarships);
  return `Celebrating ${dollars} in scholarships, ${stats.collegeAcceptances}+ college acceptances, and ${stats.fullRides} full-ride scholarships from Largo High School's Class of 2026.`;
}

export async function generateMetadata(): Promise<Metadata> {
  const stats = await fetchPublicStats();
  const description = buildWallDescription(stats);
  const canonical = getCanonicalUrl("/wall-of-wins");
  return {
    title: WALL_TITLE,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      title: WALL_TITLE,
      description,
      url: canonical,
      siteName: "Largo Lions Class of 2026",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: WALL_TITLE,
      description,
    },
  };
}

async function getWallOfWinsStructuredData() {
  const [stats, wins] = await Promise.all([
    fetchPublicStats(),
    prisma.win.findMany({
      where: { approved: true, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { institutionName: true, title: true },
    }),
  ]);

  const description = buildWallDescription(stats);
  const pageUrl = getCanonicalUrl("/wall-of-wins");

  const itemListElement = wins.map((w, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: (w.institutionName?.trim() || w.title || "Largo High School").slice(0, 200),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: WALL_TITLE,
    description,
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: itemListElement.length,
      itemListElement,
    },
  } as Record<string, unknown>;
}

export default async function WallOfWinsPage() {
  const structuredData = await getWallOfWinsStructuredData();

  return (
    <>
      <JsonLd data={structuredData} />
      <Suspense fallback={<div className="min-h-[40vh] animate-pulse rounded-card bg-navy-100" aria-hidden />}>
        <WallOfWinsPageClient />
      </Suspense>
    </>
  );
}
