import type { Metadata } from "next";
import { AdminRosterClient } from "@/components/admin/AdminRosterClient";

export const metadata: Metadata = {
  title: "Approved Roster | Staff Panel — Largo Lions Class of 2026",
  description:
    "Manage the approved enrollment roster — add students, bulk import CSV, track enrollment status.",
  robots: { index: false, follow: false },
};

export default function AdminRosterPage() {
  return <AdminRosterClient />;
}
