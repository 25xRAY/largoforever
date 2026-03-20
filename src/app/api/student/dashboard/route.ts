import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeReadinessSummary } from "@/lib/readiness-calc";
import type { Alert } from "@/types";

export const revalidate = 300;

function buildAlerts(readiness: ReturnType<typeof computeReadinessSummary>, userId: string): Alert[] {
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
    const [
      user,
      gradChecklist,
      assessments,
      serviceLearning,
      localObligations,
      ccrStatus,
      yearbookPage,
      recentWins,
      winStats,
    ] = await Promise.all([
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

    const readiness = computeReadinessSummary(userId, checklistData);
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
