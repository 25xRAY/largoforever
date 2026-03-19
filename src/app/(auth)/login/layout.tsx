import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Largo Lions Class of 2026",
  description: "Sign in to your Largo Lions Class of 2026 account.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
