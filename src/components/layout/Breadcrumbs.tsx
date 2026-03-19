"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BreadcrumbSchema } from "@/components/seo/SchemaOrg";
import { cn } from "@/lib/utils";
import { getCanonicalUrl } from "@/lib/seo";

const HOME = { name: "Home", path: "/" };

function pathToSegment(path: string): string {
  const segment = path.replace(/^\//, "").split("/")[0] ?? "";
  if (!segment) return "Home";
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Auto-generates breadcrumbs from route segments. Schema.org BreadcrumbList. Accessible nav.
 */
export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const items = [
    HOME,
    ...segments.map((s, i) => ({
      name: pathToSegment(segments.slice(0, i + 1).join("/")),
      path: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  const schemaItems = items.map((item, i) => ({
    name: item.name,
    url: getCanonicalUrl(item.path),
  }));

  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-navy-600">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden className="text-navy-400">
                    /
                  </span>
                )}
                {isLast ? (
                  <span className="font-medium text-navy-900" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="hover:text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
