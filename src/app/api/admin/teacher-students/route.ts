import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-session";
import { teacherStudentLinkSchema } from "@/lib/validations/roster-admin";
import { normalizeRosterEmail } from "@/lib/roster";
import { logger } from "@/lib/logger";

/**
 * POST /api/admin/teacher-students — link a teacher user to a student user (read-only roster for teacher UI).
 */
export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin.ok) return admin.response;

  try {
    const body = await request.json();
    const parsed = teacherStudentLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const teacherEmail = normalizeRosterEmail(parsed.data.teacherEmail);
    const studentEmail = normalizeRosterEmail(parsed.data.studentEmail);

    const [teacher, student] = await Promise.all([
      prisma.user.findUnique({ where: { email: teacherEmail } }),
      prisma.user.findUnique({ where: { email: studentEmail } }),
    ]);

    if (!teacher || teacher.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Teacher email must belong to an account with role TEACHER." },
        { status: 400 }
      );
    }
    if (!student || student.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Student email must belong to an account with role STUDENT." },
        { status: 400 }
      );
    }

    const link = await prisma.teacherStudent.upsert({
      where: {
        teacherId_studentId: { teacherId: teacher.id, studentId: student.id },
      },
      create: { teacherId: teacher.id, studentId: student.id },
      update: {},
    });

    return NextResponse.json({ link: { id: link.id } }, { status: 201 });
  } catch (e) {
    logger.error("admin teacher-students POST", { error: String(e) });
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}
