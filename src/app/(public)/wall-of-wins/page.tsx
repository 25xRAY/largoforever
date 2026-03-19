"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { WinCard } from "@/components/wins/WinCard";
import { WinFilters } from "@/components/wins/WinFilters";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

async function fetchStats() {
  const res = await fetch("/api/wins/stats");
  if (!res.ok) return { totalDollars: 0, acceptanceCount: 0, fullRideCount: 0, militaryCount: 0, tradeCount: 0 };
  return res.json();
}

async function fetchWins(params: string) {
  const res = await fetch(`/api/wins?${params}`);
  if (!res.ok) throw new Error("Failed to load wins");
  return res.json();
}

function animateValue(from: number, to: number, duration: number, onUpdate: (n: number) => void) {
  const start = performance.now();
  const run = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    onUpdate(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

export default function WallOfWinsPage() {
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();
  const [statsDisplay, setStatsDisplay] = useState({ totalDollars: 0, acceptanceCount: 0, fullRideCount: 0, militaryCount: 0 });

  const { data: stats } = useQuery({ queryKey: ["wins-stats"], queryFn: fetchStats, staleTime: 5 * 60 * 1000 });
  const { data: winsData, isLoading, isFetching } = useQuery({
    queryKey: ["wins", paramsString],
    queryFn: () => fetchWins(paramsString),
  });

  useEffect(() => {
    if (!stats) return;
    animateValue(0, stats.totalDollars, 1200, (n) => setStatsDisplay((s) => ({ ...s, totalDollars: n })));
    animateValue(0, stats.acceptanceCount, 1200, (n) => setStatsDisplay((s) => ({ ...s, acceptanceCount: n })));
    animateValue(0, stats.fullRideCount, 1200, (n) => setStatsDisplay((s) => ({ ...s, fullRideCount: n })));
    animateValue(0, stats.militaryCount + stats.tradeCount, 1200, (n) => setStatsDisplay((s) => ({ ...s, militaryCount: n })));
  }, [stats]);

  const view = searchParams.get("view") ?? "grid";
  const wins = winsData?.data ?? [];
  const total = winsData?.total ?? 0;
  const page = winsData?.page ?? 1;
  const limit = winsData?.limit ?? 24;
  const hasMore = winsData?.hasMore ?? false;

  const formatDollars = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;

  return (
    <div className="space-y-8">
      <section className="rounded-card bg-gradient-to-br from-navy-600 to-navy-800 p-8 text-white">
        <h1 className="font-heading text-3xl font-bold">Wall of Wins</h1>
        <p className="mt-2 text-white/90">Scholarships, acceptances, and milestones from the Class of 2026.</p>
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          <div>
            <p className="text-2xl font-bold text-gold-500 lg:text-3xl">{formatDollars(statsDisplay.totalDollars)}</p>
            <p className="text-sm text-white/80">Total scholarships</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-500 lg:text-3xl">{statsDisplay.acceptanceCount}+</p>
            <p className="text-sm text-white/80">College acceptances</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-500 lg:text-3xl">{statsDisplay.fullRideCount}</p>
            <p className="text-sm text-white/80">Full-ride scholarships</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-500 lg:text-3xl">{statsDisplay.militaryCount}</p>
            <p className="text-sm text-white/80">Military & trade</p>
          </div>
        </div>
      </section>

      <WinFilters />

      {isLoading ? (
        <div className={view === "list" ? "space-y-4" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-48" />
          ))}
        </div>
      ) : wins.length === 0 ? (
        <p className="py-12 text-center text-navy-600">No wins match your filters yet.</p>
      ) : (
        <>
          <div
            className={
              view === "list"
                ? "space-y-4"
                : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }
          >
            {wins.map((w: {
              id: string;
              type: string;
              title: string;
              description?: string | null;
              institutionName?: string | null;
              amount?: number | null;
              scholarshipRange?: string | null;
              militaryBranch?: string | null;
              approved: boolean;
              createdAt: string;
              user?: { firstName: string | null; lastName: string | null } | null;
            }) => (
              <WinCard
                key={w.id}
                id={w.id}
                type={w.type as "SCHOLARSHIP" | "ACCEPTANCE" | "MILITARY" | "JOB" | "AWARD" | "OTHER"}
                title={w.title}
                description={w.description}
                institutionName={w.institutionName}
                amount={w.amount}
                scholarshipRange={w.scholarshipRange}
                militaryBranch={w.militaryBranch}
                approved={w.approved}
                createdAt={w.createdAt}
                studentName={
                  w.user
                    ? [w.user.firstName, w.user.lastName].filter(Boolean).join(" ")
                    : null
                }
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  const next = new URLSearchParams(searchParams.toString());
                  next.set("page", String(page + 1));
                  window.location.search = next.toString();
                }}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
