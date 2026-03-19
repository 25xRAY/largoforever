import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Largo Lions Class of 2026",
  description: "Join the Largo Lions Class of 2026.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
