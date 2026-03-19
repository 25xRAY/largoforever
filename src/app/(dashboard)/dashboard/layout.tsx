import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard | Largo Lions Class of 2026",
  description: "Your graduation dashboard and checklist.",
  robots: { index: false, follow: false },
};

export default function DashboardSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
