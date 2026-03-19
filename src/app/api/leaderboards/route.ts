import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DistrictLeaderboardCategory, HonorDesignation } from "@prisma/client";
import { parseLeaderboardCategory, gpaTierLabel } from "@/lib/leaderboard-public";

export const revalidate = 900;

function mapCategoryParam(c: DistrictLeaderboardCategory) {
  switch (c) {
    case DistrictLeaderboardCategory.GPA:
      return "gpa";
    case DistrictLeaderboardCategory.SERVICE:
      return "service";
    case DistrictLeaderboardCategory.ACADEMIC_CHALLENGE:
      return "academic_challenge";
    case DistrictLeaderboardCategory.LEADERSHIP:
      return "leadership";
    default:
      return "gpa";
  }
}

/**
 * GET /api/leaderboards?category=gpa|service|academic_challenge|leadership
 * Public. Opted-in + verified students only. Cached 15 minutes (revalidate).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = parseLeaderboardCategory(searchParams.get("category"));
  if (!category) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const baseSelect = {
    id: true,
    firstName: true,
    lastName: true,
    preferredName: true,
    displayGpa: true,
    apIbCourseCount: true,
    leadershipRolesJson: true,
    honorDesignation: true,
    serviceLearning: { select: { hours: true, verified: true } },
    leaderboardPreferences: {
      where: { category, optedIn: true, verified: true },
      select: { id: true },
    },
  };

  const users = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      deletedAt: null,
      leaderboardPreferences: { some: { category, optedIn: true, verified: true } },
    },
    select: baseSelect,
  });

  const displayName = (u: (typeof users)[number]) =>
    u.preferredName?.trim() ||
    [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
    "Student";

  if (category === DistrictLeaderboardCategory.GPA) {
    const featured = users.filter(
      (u) =>
        u.honorDesignation === HonorDesignation.VALEDICTORIAN ||
        u.honorDesignation === HonorDesignation.SALUTATORIAN
    );
    const rest = users
      .filter((u) => u.displayGpa != null && u.displayGpa >= 3.0)
      .sort((a, b) => (b.displayGpa ?? 0) - (a.displayGpa ?? 0))
      .map((u) => {
        const gpa = u.displayGpa ?? 0;
        const { tier, label } = gpaTierLabel(gpa);
        return {
          userId: u.id,
          name: displayName(u),
          gpa,
          tier,
          tierLabel: label,
          honorDesignation:
            u.honorDesignation === HonorDesignation.NONE ? null : u.honorDesignation.toLowerCase(),
        };
      });

    return NextResponse.json({
      category: mapCategoryParam(category),
      featured: featured.map((u) => ({
        userId: u.id,
        name: displayName(u),
        designation:
          u.honorDesignation === HonorDesignation.VALEDICTORIAN
            ? "valedictorian"
            : u.honorDesignation === HonorDesignation.SALUTATORIAN
              ? "salutatorian"
              : null,
        gpa: u.displayGpa,
      })),
      entries: rest,
      privacyNote: "All participation is opt-in.",
    });
  }

  if (category === DistrictLeaderboardCategory.SERVICE) {
    const withHours = users
      .filter((u) => u.serviceLearning?.verified && (u.serviceLearning.hours ?? 0) > 0)
      .sort((a, b) => (b.serviceLearning?.hours ?? 0) - (a.serviceLearning?.hours ?? 0))
      .map((u, idx) => ({
        userId: u.id,
        name: displayName(u),
        hours: u.serviceLearning?.hours ?? 0,
        rank: idx + 1,
      }));

    const top3 = withHours.slice(0, 3);

    return NextResponse.json({
      category: mapCategoryParam(category),
      featured: top3,
      entries: withHours,
      privacyNote: "All participation is opt-in.",
    });
  }

  if (category === DistrictLeaderboardCategory.ACADEMIC_CHALLENGE) {
    const entries = users
      .filter((u) => (u.apIbCourseCount ?? 0) > 0)
      .sort((a, b) => (b.apIbCourseCount ?? 0) - (a.apIbCourseCount ?? 0))
      .map((u, idx) => ({
        userId: u.id,
        name: displayName(u),
        courseCount: u.apIbCourseCount ?? 0,
        rank: idx + 1,
      }));

    return NextResponse.json({
      category: mapCategoryParam(category),
      featured: entries.slice(0, 3),
      entries,
      privacyNote: "All participation is opt-in.",
    });
  }

  /** LEADERSHIP — non-ranked list */
  const entries = users
    .map((u) => {
      let roles: { title: string; organization?: string }[] = [];
      try {
        if (u.leadershipRolesJson) {
          const parsed = JSON.parse(u.leadershipRolesJson) as unknown;
          if (Array.isArray(parsed)) {
            roles = parsed as { title: string; organization?: string }[];
          } else if (parsed && typeof parsed === "object" && "roles" in parsed) {
            const r = (parsed as { roles: unknown }).roles;
            if (Array.isArray(r)) roles = r as { title: string; organization?: string }[];
          }
        }
      } catch {
        roles = [];
      }
      return { userId: u.id, name: displayName(u), roles };
    })
    .filter((e) => e.roles.length > 0);

  return NextResponse.json({
    category: mapCategoryParam(category),
    entries,
    privacyNote: "All participation is opt-in.",
  });
}
