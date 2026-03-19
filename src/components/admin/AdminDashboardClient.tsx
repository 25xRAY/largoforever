"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AdminStats {
  pendingWins: number;
  pendingYearbook: number;
  flaggedComments: number;
  totalStudents: number;
  classAvgReadiness: number;
  todaySignIns: number;
  winsOverTime: { date: string; count: number }[];
  readinessBuckets: { low: number; mid: number; high: number };
  winTypes: { type: string; count: number }[];
}

async function fetchStats(): Promise<AdminStats> {
  const res = await fetch("/api/admin/stats");
  if (!res.ok) throw new Error("Failed to load admin stats");
  return res.json();
}

const PIE_COLORS = ["#1e3a5f", "#c9a227", "#4a7ab0", "#2d5a87", "#8b7355"];

function StatCard({
  title,
  value,
  href,
}: {
  title: string;
  value: number | string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-card border border-navy-200 bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">{title}</p>
      <p className="mt-2 font-heading text-3xl font-bold text-navy-900">{value}</p>
    </div>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="block transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold-500"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}

/**
 * Staff overview: stat cards and Recharts summaries.
 */
export function AdminDashboardClient() {
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-stats"], queryFn: fetchStats });

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-card bg-navy-100" aria-busy="true" />;
  }
  if (error || !data) {
    return <p className="text-danger-dark">Could not load dashboard. Refresh or sign in again.</p>;
  }

  const readinessData = [
    { name: "Below 50%", count: data.readinessBuckets.low },
    { name: "50–74%", count: data.readinessBuckets.mid },
    { name: "75%+", count: data.readinessBuckets.high },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">Admin dashboard</h1>
        <p className="mt-1 text-sm text-navy-600">
          Overview of moderation queues, engagement, and class readiness.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Pending wins" value={data.pendingWins} href="/admin/moderation" />
        <StatCard title="Pending yearbook" value={data.pendingYearbook} href="/admin/moderation" />
        <StatCard
          title="Flagged / pending comments"
          value={data.flaggedComments}
          href="/admin/moderation"
        />
        <StatCard title="Active students" value={data.totalStudents} href="/admin/students" />
        <StatCard title="Class avg readiness" value={`${data.classAvgReadiness}%`} />
        <StatCard title="Sign-ins today" value={data.todaySignIns} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-card border border-navy-200 bg-white p-4 shadow-card">
          <h2 className="font-heading text-lg font-semibold text-navy-900">
            Approved wins (14 days)
          </h2>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.winsOverTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #cbd5e1" }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Wins"
                  stroke="#c9a227"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-card border border-navy-200 bg-white p-4 shadow-card">
          <h2 className="font-heading text-lg font-semibold text-navy-900">
            Readiness distribution (sample)
          </h2>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readinessData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #cbd5e1" }} />
                <Bar dataKey="count" fill="#1e3a5f" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-navy-200 bg-white p-4 shadow-card">
        <h2 className="font-heading text-lg font-semibold text-navy-900">
          Win types (all approved)
        </h2>
        <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row lg:items-start">
          <div className="h-72 w-full max-w-md">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.winTypes}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(e) => `${e.type} (${e.count})`}
                >
                  {data.winTypes.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-1 flex-wrap gap-3">
            <Link
              href="/admin/moderation"
              className="rounded-button bg-navy-500 px-4 py-2 text-sm font-medium text-white hover:bg-navy-600"
            >
              Open moderation
            </Link>
            <Link
              href="/admin/leaderboards"
              className="rounded-button border border-navy-300 px-4 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50"
            >
              Leaderboards
            </Link>
            <Link
              href="/admin/data-export"
              className="rounded-button border border-navy-300 px-4 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50"
            >
              Data export
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
