"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "", label: "All" },
  { value: "SCHOLARSHIP", label: "Scholarships" },
  { value: "ACCEPTANCE", label: "Acceptances" },
  { value: "MILITARY", label: "Military" },
  { value: "JOB", label: "Trade" },
  { value: "AWARD", label: "Award" },
  { value: "OTHER", label: "Other" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest amount" },
] as const;

/**
 * Type tabs, search input, sort dropdown, view toggle (grid/list), reset. State in URL search params.
 */
export function WinFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") ?? "";
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const view = searchParams.get("view") ?? "grid";

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      next.delete("page");
      router.push(`/wall-of-wins?${next.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem("search") as HTMLInputElement)?.value?.trim() ?? "";
    setParams({ search: q });
  };

  const reset = () => {
    router.push("/wall-of-wins");
  };

  return (
    <div className="sticky top-16 z-40 border-b border-navy-200 bg-white/95 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.value || "all"}
              type="button"
              onClick={() => setParams({ type: tab.value })}
              className={cn(
                "rounded-button px-3 py-1.5 text-sm font-medium transition-colors",
                type === tab.value
                  ? "bg-navy-500 text-white"
                  : "bg-navy-100 text-navy-700 hover:bg-navy-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px] max-w-xs">
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search wins..."
            className="w-full rounded-button border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <Button type="submit" variant="secondary" size="sm" className="ml-2">
            Search
          </Button>
        </form>
        <select
          value={sort}
          onChange={(e) => setParams({ sort: e.target.value })}
          className="rounded-button border border-navy-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="flex rounded-button border border-navy-200 p-0.5">
          <button
            type="button"
            onClick={() => setParams({ view: "grid" })}
            className={cn(
              "rounded px-2 py-1 text-sm",
              view !== "list" ? "bg-navy-200 font-medium" : "hover:bg-navy-100"
            )}
            aria-label="Grid view"
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setParams({ view: "list" })}
            className={cn(
              "rounded px-2 py-1 text-sm",
              view === "list" ? "bg-navy-200 font-medium" : "hover:bg-navy-100"
            )}
            aria-label="List view"
          >
            List
          </button>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
