import type { Metadata } from "next";
import { AdminDataExportClient } from "@/components/admin/AdminDataExportClient";

export const metadata: Metadata = {
  title: "Data Export | Staff Panel — Largo Lions Class of 2026",
  description: "Export student graduation readiness data, roster, and wins as CSV or JSON.",
  robots: { index: false, follow: false },
};

export default function AdminDataExportPage() {
  return <AdminDataExportClient />;
}
