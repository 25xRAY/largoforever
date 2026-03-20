import { z } from "zod";
import { UserRole } from "@prisma/client";

export const rosterEntryCreateSchema = z.object({
  email: z.string().email().max(256),
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  role: z.nativeEnum(UserRole),
});

export type RosterEntryCreateInput = z.infer<typeof rosterEntryCreateSchema>;

export const teacherStudentLinkSchema = z.object({
  teacherEmail: z.string().email(),
  studentEmail: z.string().email(),
});
