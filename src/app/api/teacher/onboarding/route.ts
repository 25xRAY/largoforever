import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { teacherOnboardingSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * POST /api/teacher/onboarding — TEACHER only. Completes profile (no student checklist).
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const parsed = teacherOnboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      preferredName,
      pronouns,
      teacherDepartment,
      teacherSubject,
      yearbookPublic,
      leaderboardOptIn,
    } = parsed.data;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          profileComplete: true,
          preferredName: preferredName ?? null,
          pronouns: pronouns ?? null,
          teacherDepartment,
          teacherSubject: teacherSubject.trim(),
          yearbookPublic,
          leaderboardOptIn,
        },
      }),
      prisma.auditLog.create({
        data: {
          userId,
          action: "teacher_onboarding_complete",
          resource: "user",
          details: JSON.stringify({ teacherDepartment, teacherSubject: teacherSubject.trim() }),
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Teacher onboarding failed", { userId, error: String(err) });
    return NextResponse.json({ error: "Onboarding failed. Please try again." }, { status: 500 });
  }
}
