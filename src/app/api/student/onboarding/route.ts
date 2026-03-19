import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import type { AssessmentType } from "@prisma/client";

const ASSESSMENT_TYPES: AssessmentType[] = [
  "ALGEBRA_I",
  "ENGLISH_10",
  "GOVERNMENT",
  "LIFE_SCIENCE",
];

/**
 * POST /api/student/onboarding — authenticated. Validate onboardingSchema, create GradChecklist, 4 Assessments, ServiceLearning, LocalObligations, CCRStatus; set User profileComplete + preferences. AuditLog.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id as string;

  try {
    const body = await request.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      preferredName,
      pronouns,
      completerPathway,
      graduationYear,
      yearbookPublic,
      leaderboardOptIn,
    } = parsed.data;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          profileComplete: true,
          preferredName: preferredName ?? null,
          pronouns: pronouns ?? null,
          graduationYear,
          yearbookPublic,
          leaderboardOptIn,
        },
      });

      const gradChecklist = await tx.gradChecklist.upsert({
        where: { userId },
        create: {
          userId,
          englishCredits: 0,
          mathCredits: 0,
          scienceCredits: 0,
          socialStudiesCredits: 0,
          fineArtsCredits: 0,
          peCredits: 0,
          healthCredits: 0,
          careerPathwayCredits: 0,
        },
        update: {},
      });

      for (const type of ASSESSMENT_TYPES) {
        await tx.assessment.upsert({
          where: {
            id: `${gradChecklist.id}-${type}`,
          },
          create: {
            id: `${gradChecklist.id}-${type}`,
            gradChecklistId: gradChecklist.id,
            type,
            result: "PENDING",
          },
          update: {},
        });
      }

      await tx.serviceLearning.upsert({
        where: { userId },
        create: { userId, hours: 0, verified: false },
        update: {},
      });

      await tx.localObligations.upsert({
        where: { userId },
        create: {
          userId,
          feesClear: false,
          deviceClear: false,
          booksClear: false,
          athleticClear: false,
        },
        update: {},
      });

      await tx.cCRStatus.upsert({
        where: { userId },
        create: { userId, pathway: completerPathway, met: false },
        update: { pathway: completerPathway },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: "onboarding_complete",
          resource: "user",
          details: JSON.stringify({
            completerPathway,
            graduationYear,
            yearbookPublic,
            leaderboardOptIn,
          }),
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Onboarding failed", { userId, error: String(err) });
    return NextResponse.json({ error: "Onboarding failed. Please try again." }, { status: 500 });
  }
}
