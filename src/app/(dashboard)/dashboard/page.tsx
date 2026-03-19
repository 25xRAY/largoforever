"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { GRADUATION_DATE } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ReadinessMeter } from "@/components/dashboard/ReadinessMeter";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentWins } from "@/components/dashboard/RecentWins";
import { DeadlinesWidget } from "@/components/dashboard/DeadlinesWidget";

function daysUntilGraduation(): number {
  const grad = new Date("2026-06-02");
  const now = new Date();
  return Math.max(0, Math.ceil((grad.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

async function fetchDashboard() {
  const res = await fetch("/api/student/dashboard");
  if (!res.ok) throw new Error("Failed to load dashboard");
  return res.json();
}

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-card border-2 border-danger bg-danger-light/30 p-8 text-center">
        <p className="font-medium text-navy-900">Something went wrong loading your dashboard.</p>
        <Button variant="primary" size="md" className="mt-4" onClick={() => refetch()}>
          Try again
        </Button>
        <Button variant="outline" size="md" className="mt-2 ml-2" onClick={() => router.push("/")}>
          Go home
        </Button>
      </div>
    );
  }

  const name = data.user?.preferredName || data.user?.firstName || "Lion";
  const daysLeft = daysUntilGraduation();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy-900">
            Welcome back, {name} 🦁
          </h1>
          <p className="mt-1 text-navy-600">
            {daysLeft} days until graduation — {GRADUATION_DATE}
          </p>
        </div>

        <ReadinessMeter
          percentage={data.readiness.overall}
          onCategoryClick={(id) => router.push(`/dashboard/checklist#${id}`)}
          creditsPct={data.readiness.credits.percentage}
          assessmentsPct={data.readiness.assessments.percentage}
          servicePct={data.readiness.service.percentage}
          obligationsCleared={data.readiness.obligations.cleared}
          obligationsTotal={data.readiness.obligations.total}
          ccrMet={data.readiness.ccr.met}
        />

        <section aria-labelledby="alerts-heading">
          <h2 id="alerts-heading" className="font-heading text-lg font-semibold text-navy-900 mb-4">
            Action items
          </h2>
          <AlertsList alerts={data.alerts ?? []} />
        </section>

        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="font-heading text-lg font-semibold text-navy-900 mb-4">
            Quick actions
          </h2>
          <QuickActions yearbookSlug={data.yearbookSlug ?? undefined} />
        </section>

        <section aria-labelledby="recent-wins-heading">
          <h2 id="recent-wins-heading" className="font-heading text-lg font-semibold text-navy-900 mb-4">
            Recent class wins
          </h2>
          <RecentWins wins={data.recentWins ?? []} />
        </section>
      </div>

      <aside className="space-y-6 lg:pt-0">
        <div className="rounded-card border border-navy-200 bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <Avatar
              size="lg"
              name={[data.user?.firstName, data.user?.lastName].filter(Boolean).join(" ")}
              image={data.user?.image}
            />
            <div>
              <p className="font-heading font-semibold text-navy-900">
                {data.user?.firstName} {data.user?.lastName}
              </p>
              <p className="text-xs text-navy-600 capitalize">{data.user?.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>
        <DeadlinesWidget />
        <div className="rounded-card border border-navy-200 bg-white p-4 shadow-card">
          <h3 className="font-heading text-sm font-semibold text-navy-900">Class stats</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-navy-600">Scholarships</span>
              <span className="font-medium">
                ${((data.classStats?.totalScholarships ?? 0) / 1_000_000).toFixed(1)}M
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-navy-600">Acceptances</span>
              <span className="font-medium">{data.classStats?.acceptances ?? 0}+</span>
            </li>
            <li className="flex justify-between">
              <span className="text-navy-600">Full rides</span>
              <span className="font-medium">{data.classStats?.fullRides ?? 0}</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <div className="h-16 w-64 animate-pulse rounded bg-navy-200" />
        <div className="flex justify-center">
          <div className="h-[200px] w-[200px] animate-pulse rounded-full bg-navy-200" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded bg-navy-200" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-card bg-navy-200" />
          ))}
        </div>
      </div>
      <aside className="space-y-6">
        <div className="h-24 animate-pulse rounded-card bg-navy-200" />
        <div className="h-40 animate-pulse rounded-card bg-navy-200" />
        <div className="h-32 animate-pulse rounded-card bg-navy-200" />
      </aside>
    </div>
  );
}
