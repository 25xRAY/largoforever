import { AdminStudentDetailClient } from "@/components/admin/AdminStudentDetailClient";

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminStudentDetailClient studentId={id} />;
}
