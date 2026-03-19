import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

/**
 * GET /api/resources — public, resources grouped by category, sorted by sortOrder.
 */
export async function GET() {
  const rows = await prisma.resource.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
  });

  const grouped = rows.reduce<Record<string, typeof rows>>((acc, r) => {
    const key = r.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort((a, b) => {
    const minA = Math.min(...grouped[a].map((x) => x.sortOrder));
    const minB = Math.min(...grouped[b].map((x) => x.sortOrder));
    return minA - minB || a.localeCompare(b);
  });

  return NextResponse.json({
    categories: categories.map((key) => ({
      key,
      label: categoryLabel(key),
      resources: grouped[key].map((r) => ({
        id: r.id,
        title: r.title,
        url: r.url,
        description: r.description,
      })),
    })),
  });
}

function categoryLabel(key: string): string {
  const labels: Record<string, string> = {
    crisis: "Crisis & immediate help",
    graduation: "Graduation requirements",
    fa: "FAFSA & financial aid",
    college: "College & career",
    records: "Student records",
    wellness: "Wellness & support",
    district: "District resources",
  };
  return labels[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
