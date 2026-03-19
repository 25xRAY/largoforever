import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Win | Largo Lions Class of 2026",
  robots: { index: false, follow: false },
};

export default function SubmitWinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
