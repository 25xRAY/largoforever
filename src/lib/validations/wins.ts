import { z } from "zod";

const winTypeEnum = z.enum(["SCHOLARSHIP", "ACCEPTANCE", "MILITARY", "JOB", "AWARD", "OTHER"]);

const institutionTypeEnum = z.enum([
  "FOUR_YEAR",
  "TWO_YEAR",
  "TRADE",
  "MILITARY",
  "WORKFORCE",
  "OTHER",
]);

const scholarshipRangeEnum = z.enum(["UNDER_1K", "ONE_TO_5K", "FIVE_TO_10K", "OVER_10K"]);

const scholarshipTypeEnum = z.enum(["MERIT", "NEED", "ATHLETIC", "OTHER"]);

const militaryBranchEnum = z.enum([
  "ARMY",
  "NAVY",
  "AIR_FORCE",
  "MARINES",
  "COAST_GUARD",
  "SPACE_FORCE",
]);

const baseWin = {
  type: winTypeEnum,
  title: z.string().min(1, "Title is required").max(256),
  description: z.string().min(10, "At least 10 characters").max(250).optional().nullable(),
  institutionName: z.string().min(2).max(200).optional().nullable(),
  evidenceUrl: z.string().url().optional().nullable(),
};

export const winSubmissionSchema = z
  .object({
    ...baseWin,
    institutionType: institutionTypeEnum.optional().nullable(),
    scholarshipRange: scholarshipRangeEnum.optional().nullable(),
    scholarshipType: scholarshipTypeEnum.optional().nullable(),
    militaryBranch: militaryBranchEnum.optional().nullable(),
    amount: z.number().min(0).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === "SCHOLARSHIP" && data.amount != null) return true;
      if (data.type === "SCHOLARSHIP") return true;
      return true;
    },
    { message: "Scholarship amount is optional but must be non-negative if provided." }
  );

export type WinSubmissionInput = z.infer<typeof winSubmissionSchema>;

export const winFilterSchema = z.object({
  type: winTypeEnum.optional(),
  search: z.string().max(200).optional(),
  sort: z.enum(["newest", "oldest", "highest"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type WinFilterInput = z.infer<typeof winFilterSchema>;
