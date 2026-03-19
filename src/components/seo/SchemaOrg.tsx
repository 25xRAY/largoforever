import { JsonLd } from "./JsonLd";
import { SITE_SCHEMA, FAQ_SCHEMA, WEBSITE_SCHEMA } from "@/lib/seo";

export function EducationalOrganizationSchema() {
  return <JsonLd data={SITE_SCHEMA as Record<string, unknown>} />;
}

export function FAQPageSchema() {
  return <JsonLd data={FAQ_SCHEMA as Record<string, unknown>} />;
}

export function WebSiteSchema() {
  return <JsonLd data={WEBSITE_SCHEMA as Record<string, unknown>} />;
}

export function WebPageSchema({ name, url }: { name: string; url: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url,
  };
  return <JsonLd data={data} />;
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <JsonLd data={data} />;
}

export function ProfilePageSchema({
  name,
  url,
  image,
  description,
}: {
  name: string;
  url: string;
  image?: string;
  description?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name,
      image: image ?? undefined,
      description: description ?? undefined,
    },
    url,
  };
  return <JsonLd data={data} />;
}
