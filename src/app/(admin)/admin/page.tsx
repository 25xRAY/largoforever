import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Staff Panel | Largo Lions Class of 2026",
  description: "Admin dashboard — student overview, moderation queue, and platform stats.",
  robots: { index: false, follow: false },
};

export default function AdminHomePage() {
  return <AdminDashboardClient />;
}
