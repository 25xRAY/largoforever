import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Yearbook | Largo Lions Dashboard",
  description: "Edit your digital yearbook page.",
  noIndex: true,
});

export default function DashboardYearbookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
