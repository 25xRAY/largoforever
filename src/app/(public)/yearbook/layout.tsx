import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Digital Yearbook — Class of 2026 | Largo Lions",
  description: "Browse the Largo Lions Class of 2026 digital yearbook. Celebrate your classmates and leave comments.",
  path: "/yearbook",
});

export default function YearbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
