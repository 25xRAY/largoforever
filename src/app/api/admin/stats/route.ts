import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/admin-session";
import {
  ASSESSMENTS_REQUIRED,
  CREDITS_REQUIRED,
  READINESS_WEIGHTS,
  SERVICE_HOURS_REQUIRED,
} from "@/lib/constants";

function quickReadiness(u: {
  gradChecklist: {
    englishCredits: number;
    mathCredits: number;
    scienceCredits: number;
    socialStudiesCredits: number;
    fineArtsCredits: number;
    peCredits: number;
    healthCredits: number;
    careerPathwayCredits: number;
    assessments: { result: string }[];
  } | null;
  serviceLearning: { hours: number } | null;
  localObligations: {
    feesClear: boolean;
    deviceClear: boolean;
    booksClear: boolean;
    athleticClear: boolean;
  } | null;
  ccrStatus: { met: boolean } | null;
}): number {
  if (!u.gradChecklist) return 0;
  const gc = u.gradChecklist;
  const creditsEarned =
    gc.englishCredits +
    gc.mathCredits +
    gc.scienceCredits +
    gc.socialStudiesCredits +
    gc.fineArtsCredits +
    gc.peCredits +
    gc.healthCredits +
    gc.careerPathwayCredits;
  const creditsPct = (creditsEarned / CREDITS_REQUIRED) * 100;
  const passed = gc.assessments.filter((a) => a.result === "PASS").length;
  const assessmentsPct = (passed / ASSESSMENTS_REQUIRED) * 100;
  const svcH = u.serviceLearning?.hours ?? 0;
  const servicePct = Math.min(100, (svcH / SERVICE_HOURS_REQUIRED) * 100);
  const obl = u.localObligations;
  const oblCleared = obl
    ? [obl.feesClear, obl.deviceClear, obl.booksClear, obl.athleticClear].filter(Boolean).length
    : 0;
  const oblOk = oblCleared === 4;
  const ccr = u.ccrStatus?.met ?? false;
  const overall =
    (creditsPct / 100) * READINESS_WEIGHTS.credits +
    (assessmentsPct / 100) * READINESS_WEIGHTS.assessments +
    (servicePct / 100) * READINESS_WEIGHTS.service +
    (oblOk ? READINESS_WEIGHTS.obligations : 0) +
    (ccr ? READINESS_WEIGHTS.ccr : 0);
  return Math.round(Math.min(100, overall));
}

/**
 * GET /api/admin/stats — dashboard cards + chart source aggregates.
 */
export async function GET() {
  const staff = await requireStaffSession();
  if (!staff.ok) return staff.response;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    pendingWins,
    pendingYearbook,
    flaggedComments,
    totalStudents,
    signInsToday,
    studentsSample,
    winsSeries,
    winTypeBreakdown,
  ] = await Promise.all([
    prisma.win.count({ where: { approved: false, deletedAt: null } }),
    prisma.yearbookPage.count({ where: { status: "PENDING" } }),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "STUDENT", deletedAt: null } }),
    prisma.auditLog.count({
      where: { action: "sign_in", createdAt: { gte: startOfDay } },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT", deletedAt: null },
      take: 200,
      include: {
        gradChecklist: { include: { assessments: true } },
        serviceLearning: true,
        localObligations: true,
        ccrStatus: true,
      },
    }),
    prisma.win.findMany({
      where: {
        deletedAt: null,
        approved: true,
        createdAt: { gte: new Date(Date.now() - 30 * 86400000) },
      },
      select: { createdAt: true },
    }),
    prisma.win.groupBy({
      by: ["type"],
      where: { deletedAt: null, approved: true },
      _count: true,
    }),
  ]);

  const readinessValues = studentsSample.map((u) => quickReadiness(u));
  const classAvgReadiness =
    readinessValues.length > 0
      ? Math.round(readinessValues.reduce((a, b) => a + b, 0) / readinessValues.length)
      : 0;

  const byDay = new Map<string, number>();
  for (const w of winsSeries) {
    const d = w.createdAt.toISOString().slice(0, 10);
    byDay.set(d, (byDay.get(d) ?? 0) + 1);
  }
  const winsOverTime = Array.from(byDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  return NextResponse.json({
    pendingWins,
    pendingYearbook,
    flaggedComments,
    totalStudents,
    classAvgReadiness,
    todaySignIns: signInsToday,
    winsOverTime,
    readinessBuckets: {
      low: readinessValues.filter((r) => r < 50).length,
      mid: readinessValues.filter((r) => r >= 50 && r < 75).length,
      high: readinessValues.filter((r) => r >= 75).length,
    },
    winTypes: winTypeBreakdown.map((w) => ({ type: w.type, count: w._count })),
  });
}
