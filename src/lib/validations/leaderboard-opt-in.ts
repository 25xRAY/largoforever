import { z } from "zod";

export const leaderboardOptInSchema = z.object({
  category: z.enum(["gpa", "service", "academic_challenge", "leadership"]),
});

export type LeaderboardOptInBody = z.infer<typeof leaderboardOptInSchema>;
