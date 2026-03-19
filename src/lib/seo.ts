import type { Metadata } from "next";

export interface PageSEOConfig {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://largolions2026.org";

export function getCanonicalUrl(path = ""): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, "")}${p}`;
}

export function generateOpenGraph(config: PageSEOConfig) {
  const url = getCanonicalUrl(config.path ?? "");
  return {
    title: config.title,
    description: config.description,
    url,
    siteName: "Largo Lions Class of 2026",
    images: config.image ? [{ url: config.image, width: 1200, height: 630 }] : undefined,
    type: "website" as const,
    locale: "en_US" as const,
  };
}

export function generatePageMetadata(config: PageSEOConfig): Metadata {
  const canonical = getCanonicalUrl(config.path ?? "");
  const og = generateOpenGraph(config);
  return {
    title: config.title,
    description: config.description,
    alternates: config.noIndex ? undefined : { canonical: canonical },
    robots: config.noIndex ? { index: false, follow: false } : undefined,
    openGraph: og,
    twitter: { card: "summary_large_image", title: config.title, description: config.description },
  };
}

export const SITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Largo High School",
  url: "https://largolions2026.org",
  description: "Largo High School Class of 2026 — Largo Lions. Prince George's County Public Schools.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "505 Largo Rd",
    addressLocality: "Upper Marlboro",
    addressRegion: "MD",
    postalCode: "20774",
    addressCountry: "US",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "counseling",
      email: "tomeco.dates@pgcps.org",
      telephone: "301-808-8880",
      areaServed: "US",
      availableLanguage: "English, Spanish",
    },
    {
      "@type": "ContactPoint",
      contactType: "administration",
      email: "robyn.jones@pgcps.org",
      areaServed: "US",
    },
  ],
} as const;

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How many credits do I need to graduate?", acceptedAnswer: { "@type": "Answer", text: "You need 21 total credits: English 4, Math 3, Science 3, Social Studies 3, Fine Arts 1, PE 0.5, Health 0.5, and Career Pathway 6." } },
    { "@type": "Question", name: "What assessments are required?", acceptedAnswer: { "@type": "Answer", text: "Four assessments: Algebra I, English 10, Government, and Life Science. You can meet these with state tests, AP (3+), SAT (480+/530+), ACT (20+), or IB (4+)." } },
    { "@type": "Question", name: "How many service learning hours?", acceptedAnswer: { "@type": "Answer", text: "75 hours of service learning in grades 6–12 are required for graduation." } },
    { "@type": "Question", name: "What is the Career Completer Pathway?", acceptedAnswer: { "@type": "Answer", text: "A career pathway (STEM, Health, Business, Arts/Media, IT, Construction, Education, or Public Service) that you complete as part of your 6 career pathway credits." } },
    { "@type": "Question", name: "When is graduation?", acceptedAnswer: { "@type": "Answer", text: "Largo Lions Class of 2026 graduation is June 2, 2026." } },
    { "@type": "Question", name: "Who is my counselor?", acceptedAnswer: { "@type": "Answer", text: "Tomeco Dates. Email tomeco.dates@pgcps.org or call 301-808-8880. Schedule at calendly.com/tomeco-dates." } },
  ],
} as const;

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Largo Lions Class of 2026",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
} as const;
