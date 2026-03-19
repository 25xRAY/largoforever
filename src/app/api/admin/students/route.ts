import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/admin-session";
import { Prisma, UserRole } from "@prisma/client";
import {
  ASSESSMENTS_REQUIRED,
  CREDITS_REQUIRED,
  READINESS_WEIGHTS,
  SERVICE_HOURS_REQUIRED,
} from "@/lib/constants";

function readinessPercent(u: {
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
  const gc = u.gradChecklist;
  if (!gc) return 0;
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
 * GET /api/admin/students — paginated, search, readiness range, role filter.
 */
export async function GET(request: Request) {
  const staff = await requireStaffSession();
  if (!staff.ok) return staff.response;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const q = searchParams.get("q")?.trim();
  const role = searchParams.get("role") as UserRole | null;

  const where: Prisma.UserWhereInput = {
    deletedAt: null,
    ...(role && Object.values(UserRole).includes(role) ? { role } : { role: "STUDENT" }),
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const users = await prisma.user.findMany({
    where,
    include: {
      gradChecklist: { include: { assessments: true } },
      serviceLearning: true,
      localObligations: true,
      ccrStatus: true,
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.user.count({ where });

  const withReadiness = users.map((u) => ({
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    readiness: readinessPercent({
      gradChecklist: u.gradChecklist,
      serviceLearning: u.serviceLearning,
      localObligations: u.localObligations,
      ccrStatus: u.ccrStatus,
    }),
    displayGpa: u.displayGpa,
    honorDesignation: u.honorDesignation,
  }));

  return NextResponse.json({
    data: withReadiness,
    page,
    limit,
    total,
    hasMore: page * limit < total,
  });
}
