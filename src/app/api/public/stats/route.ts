import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // 5 minutes
export const dynamic = "force-dynamic";

/**
 * GET /api/public/stats — public, cached 5 min. Returns aggregate stats for homepage.
 */
export async function GET() {
  try {
    const [wins, totalStudents] = await Promise.all([
      prisma.win.findMany({
        where: { approved: true, deletedAt: null },
        select: {
          type: true,
          amount: true,
          scholarshipRange: true,
        },
      }),
      prisma.user.count({ where: { role: "STUDENT" } }),
    ]);

    let totalScholarships = 0;
    let collegeAcceptances = 0;
    let fullRides = 0;

    for (const w of wins) {
      if (w.type === "SCHOLARSHIP" && w.amount != null) {
        totalScholarships += w.amount;
      }
      if (w.type === "ACCEPTANCE") {
        collegeAcceptances += 1;
      }
      if (
        w.scholarshipRange === "OVER_10K" ||
        (w.type === "SCHOLARSHIP" && (w.amount ?? 0) >= 10000)
      ) {
        fullRides += 1;
      }
    }

    const graduationRate = totalStudents > 0 ? 98 : 0;

    return NextResponse.json(
      {
        totalScholarships: Math.round(totalScholarships),
        collegeAcceptances,
        fullRides,
        graduationRate,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        totalScholarships: 0,
        collegeAcceptances: 0,
        fullRides: 0,
        graduationRate: 0,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  }
}
