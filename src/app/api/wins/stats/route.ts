import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

/**
 * GET — public. Cached 5min. Aggregates: totalDollars, acceptanceCount, fullRideCount, militaryCount, tradeCount (JOB type).
 */
export async function GET() {
  try {
    const [sumResult, acceptanceCount, fullRideCount, militaryCount, tradeCount] =
      await Promise.all([
        prisma.win.aggregate({
          where: {
            approved: true,
            deletedAt: null,
            type: "SCHOLARSHIP",
            amount: { not: null },
          },
          _sum: { amount: true },
        }),
        prisma.win.count({
          where: { approved: true, deletedAt: null, type: "ACCEPTANCE" },
        }),
        prisma.win.count({
          where: {
            approved: true,
            deletedAt: null,
            OR: [
              { scholarshipRange: "OVER_10K" },
              { type: "SCHOLARSHIP", amount: { gte: 10000 } },
            ],
          },
        }),
        prisma.win.count({
          where: { approved: true, deletedAt: null, type: "MILITARY" },
        }),
        prisma.win.count({
          where: { approved: true, deletedAt: null, type: "JOB" },
        }),
      ]);

    const totalDollars = sumResult._sum.amount ?? 0;

    return NextResponse.json(
      {
        totalDollars: Math.round(totalDollars),
        acceptanceCount,
        fullRideCount,
        militaryCount,
        tradeCount,
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
        totalDollars: 0,
        acceptanceCount: 0,
        fullRideCount: 0,
        militaryCount: 0,
        tradeCount: 0,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  }
}
