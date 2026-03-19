import { DistrictLeaderboardCategory } from "@prisma/client";

const QUERY_TO_ENUM: Record<string, DistrictLeaderboardCategory> = {
  gpa: DistrictLeaderboardCategory.GPA,
  service: DistrictLeaderboardCategory.SERVICE,
  academic_challenge: DistrictLeaderboardCategory.ACADEMIC_CHALLENGE,
  leadership: DistrictLeaderboardCategory.LEADERSHIP,
};

export function parseLeaderboardCategory(raw: string | null): DistrictLeaderboardCategory | null {
  if (!raw) return DistrictLeaderboardCategory.GPA;
  return QUERY_TO_ENUM[raw] ?? null;
}

export function categoryQueryFromEnum(c: DistrictLeaderboardCategory): string {
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

export type GpaTier = "high_honor" | "honor_roll" | "merit" | "listed";

export function gpaTierLabel(gpa: number): { tier: GpaTier; label: string } {
  if (gpa >= 4.0) return { tier: "high_honor", label: "High Honor (4.0+)" };
  if (gpa >= 3.5) return { tier: "honor_roll", label: "Honor Roll (3.5+)" };
  if (gpa >= 3.0) return { tier: "merit", label: "Merit (3.0+)" };
  return { tier: "listed", label: "Honors participant" };
}
