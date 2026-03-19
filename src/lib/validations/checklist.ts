import { z } from "zod";

const subjectCreditSchema = z.object({
  subject: z.string(),
  required: z.number(),
  earned: z.number(),
  percent: z.number(),
  courses: z.array(z.object({ name: z.string(), credits: z.number() })).optional(),
});

const assessmentItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  result: z.string(),
  method: z.string().nullable(),
  score: z.string().nullable(),
  completedAt: z.string().datetime().nullable(),
});

export const readinessSchema = z.object({
  overall: z.number().min(0).max(100),
  credits: z.object({
    earned: z.number(),
    required: z.number(),
    percentage: z.number(),
  }),
  assessments: z.object({
    passed: z.number(),
    required: z.number(),
    percentage: z.number(),
  }),
  service: z.object({
    completed: z.number(),
    required: z.number(),
    percentage: z.number(),
  }),
  obligations: z.object({
    cleared: z.number(),
    total: z.number(),
    allCleared: z.boolean(),
  }),
  ccr: z.object({
    met: z.boolean(),
    pathway: z.string().nullable(),
  }),
});

export const checklistCreditsSchema = z.object({
  subjects: z.array(subjectCreditSchema),
  totalEarned: z.number(),
  totalRequired: z.number(),
  percentage: z.number(),
});

export const checklistAssessmentsSchema = z.object({
  items: z.array(assessmentItemSchema),
  passed: z.number(),
  required: z.number(),
});

export const checklistServiceSchema = z.object({
  hours: z.number(),
  required: z.number(),
  percentage: z.number(),
  activities: z
    .array(
      z.object({
        id: z.string(),
        org: z.string().optional(),
        date: z.string().optional(),
        hours: z.number(),
        description: z.string().optional(),
        verified: z.boolean(),
      })
    )
    .optional(),
});

export const checklistObligationsSchema = z.object({
  feesClear: z.boolean(),
  deviceClear: z.boolean(),
  booksClear: z.boolean(),
  athleticClear: z.boolean(),
  allCleared: z.boolean(),
});

export const checklistCCRSchema = z.object({
  pathway: z.string().nullable(),
  met: z.boolean(),
  completedAt: z.string().datetime().nullable().optional(),
});

export const fullChecklistSchema = z.object({
  credits: checklistCreditsSchema,
  assessments: checklistAssessmentsSchema,
  service: checklistServiceSchema,
  obligations: checklistObligationsSchema,
  ccr: checklistCCRSchema,
  lastSynced: z.string().datetime().optional(),
});

export type ReadinessResponse = z.infer<typeof readinessSchema>;
export type FullChecklist = z.infer<typeof fullChecklistSchema>;
