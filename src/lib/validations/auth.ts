import { z } from "zod";
import { TeacherDepartment } from "@prisma/client";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type LoginInput = z.infer<typeof loginSchema>;

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.");

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters.")
      .max(50, "First name must be at most 50 characters."),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters.")
      .max(50, "Last name must be at most 50 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.acceptTerms === true, {
    message: "You must accept the terms to register.",
    path: ["acceptTerms"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

const COMPLETER_PATHWAY_VALUES = [
  "STEM",
  "HEALTH",
  "BUSINESS",
  "ARTS_MEDIA",
  "IT",
  "CONSTRUCTION",
  "EDUCATION",
  "PUBLIC_SERVICE",
  "UNDECIDED",
] as const;

export const onboardingSchema = z.object({
  preferredName: z.string().max(50).optional().nullable(),
  pronouns: z.string().max(30).optional().nullable(),
  completerPathway: z.enum(COMPLETER_PATHWAY_VALUES),
  graduationYear: z.literal(2026),
  yearbookPublic: z.boolean(),
  leaderboardOptIn: z.boolean(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const teacherOnboardingSchema = z.object({
  preferredName: z.string().max(50).optional().nullable(),
  pronouns: z.string().max(30).optional().nullable(),
  teacherDepartment: z.nativeEnum(TeacherDepartment),
  teacherSubject: z.string().min(1).max(256),
  yearbookPublic: z.boolean().optional().default(false),
  leaderboardOptIn: z.boolean().optional().default(false),
});

export type TeacherOnboardingInput = z.infer<typeof teacherOnboardingSchema>;
