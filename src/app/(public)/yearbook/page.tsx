import type { Metadata } from "next";
import { Suspense } from "react";
import { getCanonicalUrl } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/seo/JsonLd";
import { YearbookBrowseClient } from "./YearbookBrowseClient";

const BROWSE_TITLE = "Class of 2026 Digital Yearbook | Largo Lions";

export async function generateMetadata(): Promise<Metadata> {
  const count = await prisma.yearbookPage.count({
    where: { status: "APPROVED", publishedAt: { not: null } },
  });
  const description = `Browse ${count} public yearbook pages from Largo High School Class of 2026 — Largo Lions. Celebrate classmates, quotes, and memories.`;
  const canonical = getCanonicalUrl("/yearbook");
  return {
    title: BROWSE_TITLE,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      title: BROWSE_TITLE,
      description,
      url: canonical,
      siteName: "Largo Lions Class of 2026",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: BROWSE_TITLE,
      description,
    },
  };
}

async function getYearbookBrowseJsonLd() {
  const numberOfItems = await prisma.yearbookPage.count({
    where: { status: "APPROVED", publishedAt: { not: null } },
  });
  const url = getCanonicalUrl("/yearbook");
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Class of 2026 Digital Yearbook",
    description: "Digital yearbook for Largo High School Class of 2026.",
    url,
    numberOfItems,
  } as Record<string, unknown>;
}

export default async function YearbookBrowsePage() {
  const structuredData = await getYearbookBrowseJsonLd();

  return (
    <>
      <JsonLd data={structuredData} />
      <Suspense fallback={<div className="min-h-[40vh] animate-pulse rounded-card bg-navy-100" aria-hidden />}>
        <YearbookBrowseClient />
      </Suspense>
    </>
  );
}
