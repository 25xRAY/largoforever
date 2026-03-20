import type { Metadata } from "next";
import { AdminLeaderboardsClient } from "@/components/admin/AdminLeaderboardsClient";

export const metadata: Metadata = {
  title: "Leaderboards | Staff Panel — Largo Lions Class of 2026",
  description: "Manage Lions of Distinction leaderboard entries and honor designations.",
  robots: { index: false, follow: false },
};

export default function AdminLeaderboardsPage() {
  return <AdminLeaderboardsClient />;
}
