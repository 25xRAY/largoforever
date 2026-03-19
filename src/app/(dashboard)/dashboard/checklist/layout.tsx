import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Graduation Checklist | Largo Lions Class of 2026",
  description: "Your full graduation checklist: credits, assessments, service, obligations, CCR.",
  robots: { index: false, follow: false },
};

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
