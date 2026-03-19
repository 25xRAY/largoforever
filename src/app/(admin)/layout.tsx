import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const dynamic = "force-dynamic";

export default function AdminRouteGroupLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout variant="admin">{children}</DashboardLayout>;
}
