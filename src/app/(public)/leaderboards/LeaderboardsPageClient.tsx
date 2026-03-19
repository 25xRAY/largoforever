"use client";

import { useQuery } from "@tanstack/react-query";
import * as Tabs from "@radix-ui/react-tabs";
import { Trophy, Heart, BookOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type TabKey = "gpa" | "service" | "academic_challenge" | "leadership";

async function fetchBoard(cat: TabKey) {
  const res = await fetch(`/api/leaderboards?category=${cat}`);
  if (!res.ok) throw new Error("Failed to load leaderboard");
  return res.json() as Promise<Record<string, unknown>>;
}

const TAB_META: { key: TabKey; label: string; icon: typeof Trophy }[] = [
  { key: "gpa", label: "Academic honors", icon: Trophy },
  { key: "service", label: "Service leaders", icon: Heart },
  { key: "academic_challenge", label: "Academic challenge", icon: BookOpen },
  { key: "leadership", label: "Leadership", icon: Users },
];

/**
 * Radix tabs switching public leaderboard API categories.
 */
export function LeaderboardsPageClient() {
  return (
    <Tabs.Root defaultValue="gpa" className="space-y-8">
      <Tabs.List
        className="flex flex-wrap gap-2 border-b border-navy-200 pb-2"
        aria-label="Leaderboard categories"
      >
        {TAB_META.map((t) => {
          const Icon = t.icon;
          return (
            <Tabs.Trigger
              key={t.key}
              value={t.key}
              className={cn(
                "inline-flex items-center gap-2 rounded-button px-4 py-2 text-sm font-medium transition-colors",
                "data-[state=active]:bg-navy-500 data-[state=active]:text-white",
                "data-[state=inactive]:bg-navy-100 data-[state=inactive]:text-navy-800 hover:data-[state=inactive]:bg-navy-200",
                "focus:outline-none focus:ring-2 focus:ring-gold-500"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {t.label}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>

      {TAB_META.map((t) => (
        <Tabs.Content key={t.key} value={t.key} className="outline-none">
          <BoardPanel category={t.key} />
        </Tabs.Content>
      ))}

      <p className="text-center text-sm text-navy-600">
        All participation is opt-in. Academic and service listings are verified by staff before
        publication.
      </p>
    </Tabs.Root>
  );
}

function BoardPanel({ category }: { category: TabKey }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["leaderboard", category],
    queryFn: () => fetchBoard(category),
  });

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-card bg-navy-100" aria-busy="true" />;
  }
  if (error || !data) {
    return <p className="text-danger">Could not load this board.</p>;
  }

  if (category === "leadership") {
    const entries =
      (data.entries as { name: string; roles: { title: string; organization?: string }[] }[]) ?? [];
    return (
      <ul className="space-y-4">
        {entries.map((e) => (
          <li key={e.name} className="rounded-card border border-navy-200 bg-white p-4 shadow-card">
            <p className="font-heading font-semibold text-navy-900">{e.name}</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-navy-700">
              {e.roles.map((r, i) => (
                <li key={i}>
                  {r.title}
                  {r.organization ? ` — ${r.organization}` : ""}
                </li>
              ))}
            </ul>
          </li>
        ))}
        {entries.length === 0 && <p className="text-navy-600">No leadership entries yet.</p>}
      </ul>
    );
  }

  if (category === "service") {
    const featured = (data.featured as { name: string; hours: number; rank: number }[]) ?? [];
    const entries = (data.entries as { name: string; hours: number; rank: number }[]) ?? [];
    return (
      <div className="space-y-6">
        {featured.length > 0 && (
          <section>
            <h2 className="font-heading text-lg font-semibold text-navy-900">
              Top service leaders
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {featured.slice(0, 3).map((f) => (
                <div
                  key={f.rank}
                  className="rounded-card border-2 border-gold-400 bg-gold-50 p-4 text-center shadow-card"
                >
                  <p className="text-2xl font-bold text-navy-900">#{f.rank}</p>
                  <p className="font-medium text-navy-800">{f.name}</p>
                  <p className="text-sm text-navy-600">{f.hours} hrs</p>
                </div>
              ))}
            </div>
          </section>
        )}
        <ol className="space-y-2">
          {entries.map((e) => (
            <li
              key={e.rank}
              className="flex items-center justify-between rounded-button border border-navy-100 bg-white p-3 shadow-sm"
            >
              <span>
                <span className="font-medium text-navy-800">{e.rank}.</span> {e.name}
              </span>
              <span className="text-navy-600">{e.hours} hrs</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (category === "academic_challenge") {
    const entries = (data.entries as { name: string; courseCount: number; rank: number }[]) ?? [];
    return (
      <ol className="space-y-2">
        {entries.map((e) => (
          <li
            key={e.rank}
            className="flex items-center justify-between rounded-button border border-navy-100 bg-white p-3"
          >
            <span>
              {e.rank}. {e.name}
            </span>
            <span className="font-medium text-navy-700">{e.courseCount} AP / IB courses</span>
          </li>
        ))}
        {entries.length === 0 && <p className="text-navy-600">No entries yet.</p>}
      </ol>
    );
  }

  const featured =
    (data.featured as { name: string; designation: string | null; gpa: number | null }[]) ?? [];
  const entries = (data.entries as { name: string; gpa: number; tierLabel: string }[]) ?? [];

  return (
    <div className="space-y-8">
      {featured.filter((f) => f.designation).length > 0 && (
        <section>
          <h2 className="font-heading text-lg font-semibold text-navy-900">Class honors</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {featured
              .filter((f) => f.designation)
              .map((f) => (
                <div
                  key={f.name}
                  className="rounded-card border-2 border-gold-500 bg-gradient-to-br from-navy-600 to-navy-800 p-6 text-white shadow-card"
                >
                  <p className="text-sm uppercase tracking-wide text-gold-300">
                    {f.designation === "valedictorian" ? "Valedictorian" : "Salutatorian"}
                  </p>
                  <p className="mt-2 font-heading text-2xl font-bold">{f.name}</p>
                  {f.gpa != null && <p className="mt-1 text-white/90">GPA {f.gpa.toFixed(2)}</p>}
                </div>
              ))}
          </div>
        </section>
      )}
      <section>
        <h2 className="font-heading text-lg font-semibold text-navy-900">Honor roll tiers</h2>
        <ul className="mt-3 space-y-2">
          {entries.map((e, i) => (
            <li
              key={`${e.name}-${i}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-button border border-navy-100 bg-white p-3"
            >
              <span className="font-medium text-navy-900">{e.name}</span>
              <span className="text-sm text-navy-600">
                {e.tierLabel} · {e.gpa.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        {entries.length === 0 && <p className="text-navy-600">No GPA listings yet.</p>}
      </section>
    </div>
  );
}
