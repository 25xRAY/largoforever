import type { Metadata } from "next";
import { generatePageMetadata, getCanonicalUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ResourcesPageClient } from "./ResourcesPageClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Resources & Support — Largo High School Class of 2026",
  description:
    "Largo High School graduation requirements 2026 — crisis lines, FAFSA, transcripts, assessments, service hours, and counseling links.",
  path: "/resources",
});

export default function ResourcesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many credits do I need to graduate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "21 credits including required subject areas and career pathway credits per PGCPS.",
        },
      },
      {
        "@type": "Question",
        name: "How many service-learning hours are required?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "75 hours documented across grades 6–12 for PGCPS.",
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={faqSchema} />
      <h1 className="font-heading text-3xl font-bold text-navy-900 md:text-4xl">
        Resources &amp; support
      </h1>
      <p className="mt-2 text-navy-700">
        Crisis help, graduation tools, FAFSA, and wellness —{" "}
        <strong>Largo High School graduation requirements 2026</strong>.
      </p>
      <p className="mt-1 text-sm text-navy-600">
        <a href={getCanonicalUrl("/wall-of-wins")} className="text-gold-600 hover:underline">
          Wall of Wins
        </a>{" "}
        ·{" "}
        <a href={getCanonicalUrl("/yearbook")} className="text-gold-600 hover:underline">
          Digital yearbook
        </a>
      </p>
      <div className="mt-8">
        <ResourcesPageClient />
      </div>
    </div>
  );
}
