import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Largo Lions Class of 2026",
  description: "Manage your account password, privacy settings, and security preferences.",
  robots: { index: false, follow: false },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
