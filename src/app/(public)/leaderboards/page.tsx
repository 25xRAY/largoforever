import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { LeaderboardsPageClient } from "./LeaderboardsPageClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Lions of Distinction — Class of 2026 Honors",
  description:
    "Largo High School Class of 2026 honors: academic tiers, service leaders, academic challenge, and leadership — all opt-in.",
  path: "/leaderboards",
});

export default function LeaderboardsPage() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Lions of Distinction — Class of 2026",
    description: "Opt-in honors and recognition for Largo Lions Class of 2026.",
    url: "https://largolions2026.org/leaderboards",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={structured} />
      <h1 className="font-heading text-3xl font-bold text-navy-900 md:text-4xl">
        Lions of Distinction 🏅
      </h1>
      <p className="mt-2 text-navy-700">
        Celebrate classmates who opted in to share verified academic honors, service hours,
        coursework, and leadership roles.
      </p>
      <div className="mt-10">
        <LeaderboardsPageClient />
      </div>
    </div>
  );
}
