import type { Metadata } from "next";
import { AdminStudentDetailClient } from "@/components/admin/AdminStudentDetailClient";

export const metadata: Metadata = {
  title: "Student Detail | Staff Panel — Largo Lions Class of 2026",
  robots: { index: false, follow: false },
};

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminStudentDetailClient studentId={id} />;
}
