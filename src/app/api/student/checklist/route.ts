import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CREDITS_REQUIRED, SERVICE_HOURS_REQUIRED, ASSESSMENTS_REQUIRED, SUBJECT_CREDITS } from "@/lib/constants";

const SUBJECT_KEYS = [
  "english",
  "math",
  "science",
  "socialStudies",
  "fineArts",
  "pe",
  "health",
  "careerPathway",
] as const;

/**
 * GET /api/student/checklist — authenticated. Returns full checklist: credits, assessments, service, obligations, CCR.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id as string;

  try {
    const [gradChecklist, assessments, serviceLearning, localObligations, ccrStatus] =
      await Promise.all([
        prisma.gradChecklist.findUnique({ where: { userId } }),
        prisma.assessment.findMany({
          where: { gradChecklist: { userId } },
          orderBy: { type: "asc" },
        }),
        prisma.serviceLearning.findUnique({ where: { userId } }),
        prisma.localObligations.findUnique({ where: { userId } }),
        prisma.cCRStatus.findUnique({ where: { userId } }),
      ]);

    const checklist = gradChecklist;
    const totalEarned = checklist
      ? checklist.englishCredits +
        checklist.mathCredits +
        checklist.scienceCredits +
        checklist.socialStudiesCredits +
        checklist.fineArtsCredits +
        checklist.peCredits +
        checklist.healthCredits +
        checklist.careerPathwayCredits
      : 0;
    const creditsPercentage = CREDITS_REQUIRED > 0 ? (totalEarned / CREDITS_REQUIRED) * 100 : 0;

    const creditKeys: Record<(typeof SUBJECT_KEYS)[number], keyof NonNullable<typeof checklist>> = {
      english: "englishCredits",
      math: "mathCredits",
      science: "scienceCredits",
      socialStudies: "socialStudiesCredits",
      fineArts: "fineArtsCredits",
      pe: "peCredits",
      health: "healthCredits",
      careerPathway: "careerPathwayCredits",
    };
    const subjects = SUBJECT_KEYS.map((key) => {
      const required = SUBJECT_CREDITS[key] ?? 0;
      const earned = checklist ? Number(checklist[creditKeys[key]] ?? 0) : 0;
      const percent = required > 0 ? (earned / required) * 100 : 0;
      return {
        subject: key,
        required,
        earned,
        percent: Math.round(percent),
        courses: [] as { name: string; credits: number }[],
      };
    });

    const assessmentItems = assessments.map((a) => ({
      id: a.id,
      type: a.type,
      result: a.result,
      method: a.method,
      score: a.score,
      completedAt: a.completedAt?.toISOString() ?? null,
    }));

    const assessmentsPassed = assessments.filter((a) => a.result === "PASS").length;
    const serviceHours = serviceLearning?.hours ?? 0;
    const servicePercentage = SERVICE_HOURS_REQUIRED > 0 ? (serviceHours / SERVICE_HOURS_REQUIRED) * 100 : 0;

    const obligations = localObligations
      ? {
          feesClear: localObligations.feesClear,
          deviceClear: localObligations.deviceClear,
          booksClear: localObligations.booksClear,
          athleticClear: localObligations.athleticClear,
          allCleared:
            localObligations.feesClear &&
            localObligations.deviceClear &&
            localObligations.booksClear &&
            localObligations.athleticClear,
        }
      : {
          feesClear: false,
          deviceClear: false,
          booksClear: false,
          athleticClear: false,
          allCleared: false,
        };

    const payload = {
      credits: {
        subjects,
        totalEarned,
        totalRequired: CREDITS_REQUIRED,
        percentage: Math.round(Math.min(100, creditsPercentage)),
      },
      assessments: {
        items: assessmentItems,
        passed: assessmentsPassed,
        required: ASSESSMENTS_REQUIRED,
      },
      service: {
        hours: serviceHours,
        required: SERVICE_HOURS_REQUIRED,
        percentage: Math.round(Math.min(100, servicePercentage)),
        activities: [],
      },
      obligations,
      ccr: {
        pathway: ccrStatus?.pathway ?? null,
        met: ccrStatus?.met ?? false,
        completedAt: ccrStatus?.completedAt?.toISOString() ?? null,
      },
      lastSynced: new Date().toISOString(),
    };

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json({ error: "Failed to load checklist" }, { status: 500 });
  }
}
