"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { YearbookCard } from "@/components/yearbook";
import { Button, Input, Skeleton } from "@/components/ui";

const PAGE_SIZE = 20;

async function fetchYearbook(params: string) {
  const res = await fetch(`/api/yearbook?${params}`);
  if (!res.ok) throw new Error("Failed to load yearbook");
  return res.json();
}

export function YearbookBrowseClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));
  if (search.trim()) params.set("search", search.trim());

  const { data, isLoading } = useQuery({
    queryKey: ["yearbook", params.toString()],
    queryFn: () => fetchYearbook(params.toString()),
  });

  const pages = data?.data ?? [];
  const total = data?.total ?? 0;
  const hasMore = data?.hasMore ?? false;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams();
    next.set("page", "1");
    if (search.trim()) next.set("search", search.trim());
    router.push(`/yearbook?${next.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <section className="rounded-card bg-gradient-to-br from-navy-600 to-navy-800 p-8 text-white">
        <h1 className="font-heading text-3xl font-bold">Class of 2026 Digital Yearbook 📖</h1>
        <p className="mt-2 text-white/90">
          Class of 2026 — Largo Lions. Browse and celebrate your classmates.
        </p>
        <form onSubmit={handleSearch} className="mt-6 flex flex-wrap gap-3">
          <Input
            type="search"
            placeholder="Search by name or tagline…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[200px] max-w-md"
          />
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
        </form>
      </section>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-64" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <p className="py-12 text-center text-navy-600">No yearbook pages match yet.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pages.map(
              (p: {
                slug: string;
                displayName: string | null;
                headline: string | null;
                tagline: string | null;
                imageUrl: string | null;
                template: string;
              }) => (
                <YearbookCard
                  key={p.slug}
                  slug={p.slug ?? ""}
                  displayName={p.displayName}
                  headline={p.headline}
                  tagline={p.tagline}
                  imageUrl={p.imageUrl}
                  template={p.template ?? "CLASSIC"}
                />
              )
            )}
          </div>
          <div className="flex items-center justify-center gap-4 pt-8">
            {page > 1 && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  const next = new URLSearchParams(searchParams.toString());
                  next.set("page", String(page - 1));
                  router.push(`/yearbook?${next.toString()}`);
                }}
              >
                Previous
              </Button>
            )}
            <span className="text-navy-600">
              Page {page} · {total} total
            </span>
            {hasMore && (
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  const next = new URLSearchParams(searchParams.toString());
                  next.set("page", String(page + 1));
                  router.push(`/yearbook?${next.toString()}`);
                }}
              >
                Next
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
