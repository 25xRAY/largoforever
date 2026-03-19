import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CREDITS_REQUIRED,
  SERVICE_HOURS_REQUIRED,
  ASSESSMENTS_REQUIRED,
  READINESS_WEIGHTS,
} from "@/lib/constants";
import type { Alert } from "@/types";

export const revalidate = 300;

function computeReadiness(userId: string, data: {
  gradChecklist: { englishCredits: number; mathCredits: number; scienceCredits: number; socialStudiesCredits: number; fineArtsCredits: number; peCredits: number; healthCredits: number; careerPathwayCredits: number } | null;
  assessments: { result: string }[];
  serviceLearning: { hours: number } | null;
  localObligations: { feesClear: boolean; deviceClear: boolean; booksClear: boolean; athleticClear: boolean } | null;
  ccrStatus: { met: boolean; pathway: string | null } | null;
}) {
  const creditsEarned = data.gradChecklist
    ? data.gradChecklist.englishCredits +
      data.gradChecklist.mathCredits +
      data.gradChecklist.scienceCredits +
      data.gradChecklist.socialStudiesCredits +
      data.gradChecklist.fineArtsCredits +
      data.gradChecklist.peCredits +
      data.gradChecklist.healthCredits +
      data.gradChecklist.careerPathwayCredits
    : 0;
  const creditsPct = CREDITS_REQUIRED > 0 ? (creditsEarned / CREDITS_REQUIRED) * 100 : 0;

  const assessmentsPassed = data.assessments.filter((a) => a.result === "PASS").length;
  const assessmentsPct = ASSESSMENTS_REQUIRED > 0 ? (assessmentsPassed / ASSESSMENTS_REQUIRED) * 100 : 0;

  const serviceHours = data.serviceLearning?.hours ?? 0;
  const servicePct = SERVICE_HOURS_REQUIRED > 0 ? (serviceHours / SERVICE_HOURS_REQUIRED) * 100 : 0;

  const obligations = data.localObligations;
  const obligationsCleared = obligations
    ? [obligations.feesClear, obligations.deviceClear, obligations.booksClear, obligations.athleticClear].filter(Boolean).length
    : 0;
  const obligationsAllCleared = obligationsCleared === 4;

  const ccrMet = data.ccrStatus?.met ?? false;

  const overall =
    (creditsPct / 100) * READINESS_WEIGHTS.credits +
    (assessmentsPct / 100) * READINESS_WEIGHTS.assessments +
    (servicePct / 100) * READINESS_WEIGHTS.service +
    (obligationsAllCleared ? READINESS_WEIGHTS.obligations : 0) +
    (ccrMet ? READINESS_WEIGHTS.ccr : 0);

  return {
    overall: Math.round(Math.min(100, Math.max(0, overall))),
    credits: {
      earned: creditsEarned,
      required: CREDITS_REQUIRED,
      percentage: Math.round(Math.min(100, creditsPct)),
    },
    assessments: {
      passed: assessmentsPassed,
      required: ASSESSMENTS_REQUIRED,
      percentage: Math.round(Math.min(100, assessmentsPct)),
    },
    service: {
      completed: serviceHours,
      required: SERVICE_HOURS_REQUIRED,
      percentage: Math.round(Math.min(100, servicePct)),
    },
    obligations: {
      cleared: obligationsCleared,
      total: 4,
      allCleared: obligationsAllCleared,
    },
    ccr: {
      met: ccrMet,
      pathway: data.ccrStatus?.pathway ?? null,
    },
  };
}

function buildAlerts(
  readiness: ReturnType<typeof computeReadiness>,
  userId: string
): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();

  if (readiness.assessments.passed < readiness.assessments.required) {
    alerts.push({
      id: `alert-assessments-${userId}`,
      type: "ASSESSMENTS",
      title: "Assessments incomplete",
      message: `You have ${readiness.assessments.passed} of ${readiness.assessments.required} assessments passed.`,
      priority: "RED",
      actionUrl: "/dashboard/checklist#assessments",
      createdAt: now,
    });
  }

  if (readiness.credits.percentage < 100) {
    alerts.push({
      id: `alert-credits-${userId}`,
      type: "CREDITS",
      title: "Credits in progress",
      message: `${readiness.credits.earned}/${readiness.credits.required} credits.`,
      priority: readiness.credits.percentage >= 70 ? "YELLOW" : "RED",
      actionUrl: "/dashboard/checklist#credits",
      createdAt: now,
    });
  }

  if (readiness.service.percentage < 100) {
    alerts.push({
      id: `alert-service-${userId}`,
      type: "SERVICE",
      title: "Service learning hours",
      message: `You have ${readiness.service.completed} of ${readiness.service.required} hours.`,
      priority: readiness.service.percentage >= 50 ? "YELLOW" : "RED",
      actionUrl: "/dashboard/checklist#service",
      createdAt: now,
    });
  }

  if (!readiness.obligations.allCleared) {
    alerts.push({
      id: `alert-obligations-${userId}`,
      type: "OBLIGATIONS",
      title: "Outstanding obligations",
      message: "Some fees or items are not yet cleared.",
      priority: "YELLOW",
      actionUrl: "/dashboard/checklist#obligations",
      createdAt: now,
    });
  }

  if (!readiness.ccr.met) {
    alerts.push({
      id: `alert-ccr-${userId}`,
      type: "CCR",
      title: "CCR pathway",
      message: "Complete your Career Completer pathway.",
      priority: "YELLOW",
      actionUrl: "/dashboard/checklist#ccr",
      createdAt: now,
    });
  }

  return alerts.sort((a, b) => {
    const order = { RED: 3, YELLOW: 2, GREEN: 1 };
    return (order[b.priority] ?? 0) - (order[a.priority] ?? 0);
  });
}

/**
 * GET /api/student/dashboard — authenticated. Returns user, readiness, alerts, recentWins, classStats. Cache 300s.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id as string;

  try {
    const [user, gradChecklist, assessments, serviceLearning, localObligations, ccrStatus, yearbookPage, recentWins, winStats] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { firstName: true, lastName: true, preferredName: true, image: true, role: true },
        }),
        prisma.gradChecklist.findUnique({ where: { userId } }),
        prisma.assessment.findMany({
          where: { gradChecklist: { userId } },
          select: { result: true },
        }),
        prisma.serviceLearning.findUnique({ where: { userId } }),
        prisma.localObligations.findUnique({ where: { userId } }),
        prisma.cCRStatus.findUnique({ where: { userId } }),
        prisma.yearbookPage.findUnique({
          where: { userId },
          select: { slug: true },
        }),
        prisma.win.findMany({
          where: { approved: true, deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            institutionName: true,
            user: { select: { firstName: true, lastName: true } },
          },
        }),
        prisma.win.aggregate({
          where: { approved: true, deletedAt: null },
          _sum: { amount: true },
          _count: { id: true },
        }),
      ]);

    const checklistData = {
      gradChecklist,
      assessments,
      serviceLearning,
      localObligations,
      ccrStatus,
    };

    const readiness = computeReadiness(userId, checklistData);
    const alerts = buildAlerts(readiness, userId);

    const winsWithStudent = recentWins.map((w) => ({
      id: w.id,
      type: w.type,
      title: w.title,
      description: w.description,
      institutionName: w.institutionName,
      studentName: w.user
        ? [w.user.firstName, w.user.lastName].filter(Boolean).join(" ") || "A Largo Lion"
        : "A Largo Lion",
    }));

    const acceptances = await prisma.win.count({
      where: { approved: true, deletedAt: null, type: "ACCEPTANCE" },
    });
    const fullRides = await prisma.win.count({
      where: {
        approved: true,
        deletedAt: null,
        OR: [{ scholarshipRange: "OVER_10K" }, { amount: { gte: 10000 } }],
      },
    });

    const payload = {
      user: {
        firstName: user?.firstName ?? null,
        lastName: user?.lastName ?? null,
        preferredName: user?.preferredName ?? null,
        image: user?.image ?? null,
        role: user?.role ?? "STUDENT",
      },
      yearbookSlug: yearbookPage?.slug ?? null,
      readiness,
      alerts,
      recentWins: winsWithStudent,
      classStats: {
        totalScholarships: winStats._sum.amount ?? 0,
        acceptances,
        fullRides,
      },
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "private, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
