import type { Metadata } from "next";
import { AdminStudentsTableClient } from "@/components/admin/AdminStudentsTableClient";

export const metadata: Metadata = {
  title: "Students | Staff Panel — Largo Lions Class of 2026",
  description: "Browse, search, and manage Class of 2026 student records and graduation readiness.",
  robots: { index: false, follow: false },
};

export default function AdminStudentsPage() {
  return <AdminStudentsTableClient />;
}
