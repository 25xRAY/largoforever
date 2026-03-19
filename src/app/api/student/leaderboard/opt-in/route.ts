import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DistrictLeaderboardCategory } from "@prisma/client";
import { leaderboardOptInSchema } from "@/lib/validations/leaderboard-opt-in";

const MAP: Record<string, DistrictLeaderboardCategory> = {
  gpa: DistrictLeaderboardCategory.GPA,
  service: DistrictLeaderboardCategory.SERVICE,
  academic_challenge: DistrictLeaderboardCategory.ACADEMIC_CHALLENGE,
  leadership: DistrictLeaderboardCategory.LEADERSHIP,
};

/**
 * POST /api/student/leaderboard/opt-in — toggle opt-in for a category (student or admin testing as student).
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leaderboardOptInSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const category = MAP[parsed.data.category];
  if (!category) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const existing = await prisma.userLeaderboardPreference.findUnique({
    where: { userId_category: { userId: session.user.id, category } },
  });

  const nextOpted = !(existing?.optedIn ?? false);

  await prisma.userLeaderboardPreference.upsert({
    where: { userId_category: { userId: session.user.id, category } },
    create: {
      userId: session.user.id,
      category,
      optedIn: true,
      verified: false,
    },
    update: {
      optedIn: nextOpted,
      ...(nextOpted === false ? { verified: false } : {}),
    },
  });

  const updated = await prisma.userLeaderboardPreference.findUnique({
    where: { userId_category: { userId: session.user.id, category } },
  });

  return NextResponse.json({
    category: parsed.data.category,
    optedIn: updated?.optedIn ?? nextOpted,
    verified: updated?.verified ?? false,
  });
}
