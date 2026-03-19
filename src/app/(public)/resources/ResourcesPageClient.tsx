"use client";

import { useQuery } from "@tanstack/react-query";
import * as Tabs from "@radix-ui/react-tabs";
import { CrisisSection } from "@/components/resources/CrisisSection";
import { ResourceCategory } from "@/components/resources/ResourceCategory";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { cn } from "@/lib/utils";

interface CategoryGroup {
  key: string;
  label: string;
  resources: { id: string; title: string; url: string; description: string | null }[];
}

async function fetchResources(): Promise<{ categories: CategoryGroup[] }> {
  const res = await fetch("/api/resources");
  if (!res.ok) throw new Error("Failed to load resources");
  return res.json();
}

const TAB_ORDER = [
  { match: "graduation", label: "Graduation requirements" },
  { match: "fa", label: "FAFSA & financial aid" },
  { match: "college", label: "College & career" },
  { match: "records", label: "Student records" },
  { match: "wellness", label: "Wellness & support" },
];

/**
 * Tabbed resource sections below crisis hero.
 */
export function ResourcesPageClient() {
  const { data, isLoading } = useQuery({ queryKey: ["resources-hub"], queryFn: fetchResources });

  const groups = data?.categories ?? [];
  const defaultTab =
    TAB_ORDER.find((t) => groups.some((g) => g.key === t.match))?.match ??
    groups[0]?.key ??
    "graduation";

  return (
    <div className="space-y-10">
      <CrisisSection />

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-card bg-navy-100" aria-busy="true" />
      ) : (
        <Tabs.Root defaultValue={defaultTab} className="space-y-6">
          <Tabs.List
            className="flex flex-wrap gap-2 border-b border-navy-200 pb-2"
            aria-label="Resource categories"
          >
            {TAB_ORDER.map((t) => {
              const has = groups.some((g) => g.key === t.match);
              if (!has) return null;
              return (
                <Tabs.Trigger
                  key={t.match}
                  value={t.match}
                  className={cn(
                    "rounded-button px-3 py-1.5 text-sm font-medium",
                    "data-[state=active]:bg-navy-500 data-[state=active]:text-white",
                    "data-[state=inactive]:bg-navy-100 text-navy-800 data-[state=inactive]:hover:bg-navy-200",
                    "focus:outline-none focus:ring-2 focus:ring-gold-500"
                  )}
                >
                  {t.label}
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>
          {TAB_ORDER.map((t) => {
            const grp = groups.find((g) => g.key === t.match);
            if (!grp) return null;
            return (
              <Tabs.Content key={t.match} value={t.match} className="outline-none">
                <ResourceCategory title={grp.label} resources={grp.resources} />
              </Tabs.Content>
            );
          })}
        </Tabs.Root>
      )}

      <div className="rounded-card border border-navy-200 bg-navy-50 p-6">
        <h2 className="font-heading text-lg font-semibold text-navy-900">District & other links</h2>
        <ul className="mt-3 space-y-2 text-sm text-navy-700">
          {(data?.categories ?? [])
            .filter((c) => !TAB_ORDER.some((t) => t.match === c.key))
            .map((c) => (
              <li key={c.key}>
                <ResourceCategory title={c.label} resources={c.resources} />
              </li>
            ))}
        </ul>
      </div>

      <FAQAccordion />
    </div>
  );
}
