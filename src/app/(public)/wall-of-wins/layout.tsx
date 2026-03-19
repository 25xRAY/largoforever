import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wall of Wins — Largo Lions Class of 2026 Scholarships & Acceptances",
  description:
    "Celebrate scholarships, college acceptances, military commitments, and more from Largo High School Class of 2026.",
  robots: { index: true, follow: true },
};

export default function WallOfWinsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
