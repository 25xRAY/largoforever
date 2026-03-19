import { z } from "zod";
import { ModerationStatus, HonorDesignation, UserRole } from "@prisma/client";

export const moderationActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("approve"),
    type: z.enum(["win", "yearbook", "comment"]),
    id: z.string().uuid(),
    notes: z.string().max(2000).optional(),
  }),
  z.object({
    action: z.literal("reject"),
    type: z.enum(["win", "yearbook", "comment"]),
    id: z.string().uuid(),
    notes: z.string().max(2000),
  }),
  z.object({
    action: z.literal("flag"),
    type: z.enum(["win", "yearbook", "comment"]),
    id: z.string().uuid(),
    notes: z.string().max(2000).optional(),
  }),
]);

export const adminExportSchema = z.object({
  type: z.enum(["students", "wins", "yearbook", "audit"]),
  dateRange: z
    .object({
      from: z.string().datetime(),
      to: z.string().datetime(),
    })
    .optional(),
});

export const studentAdminPatchSchema = z.object({
  verifiedAgainstOfficialRecords: z.literal(true),
  staffNotes: z.string().max(2000).optional(),
  firstName: z.string().min(1).max(128).optional(),
  lastName: z.string().min(1).max(128).optional(),
  displayGpa: z.number().min(0).max(5).nullable().optional(),
  apIbCourseCount: z.number().int().min(0).max(64).optional(),
  honorDesignation: z.nativeEnum(HonorDesignation).optional(),
  englishCredits: z.number().min(0).max(10).optional(),
  mathCredits: z.number().min(0).max(10).optional(),
  serviceHours: z.number().min(0).max(500).optional(),
  serviceVerified: z.boolean().optional(),
  leadershipRolesJson: z.string().max(16000).nullable().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export const leaderAdminVerifySchema = z.object({
  userId: z.string().uuid(),
  category: z.enum(["gpa", "service", "academic_challenge", "leadership"]),
  verified: z.boolean(),
});

export const honorAssignSchema = z.object({
  userId: z.string().uuid(),
  designation: z.nativeEnum(HonorDesignation),
});
