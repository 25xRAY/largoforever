import type { Metadata } from "next";
import { AdminModerationClient } from "@/components/admin/AdminModerationClient";

export const metadata: Metadata = {
  title: "Moderation | Staff Panel — Largo Lions Class of 2026",
  description: "Review and approve Wall of Wins submissions and yearbook pages.",
  robots: { index: false, follow: false },
};

export default function AdminModerationPage() {
  return <AdminModerationClient />;
}
