import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeReadinessSummary } from "@/lib/readiness-calc";

/**
 * GET /api/teacher/students — linked students only; read-only readiness summary per student.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const teacherId = session.user.id;

  try {
    const links = await prisma.teacherStudent.findMany({
      where: { teacherId },
      include: {
        student: {
          include: {
            gradChecklist: {
              include: {
                assessments: { select: { result: true } },
              },
            },
            serviceLearning: true,
            localObligations: true,
            ccrStatus: true,
          },
        },
      },
    });

    const students = links.map((link) => {
      const s = link.student;
      const assessments = s.gradChecklist?.assessments ?? [];
      const checklistData = {
        gradChecklist: s.gradChecklist,
        assessments,
        serviceLearning: s.serviceLearning,
        localObligations: s.localObligations,
        ccrStatus: s.ccrStatus,
      };
      const readiness = computeReadinessSummary(s.id, checklistData);
      return {
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        preferredName: s.preferredName,
        email: s.email,
        readiness,
      };
    });

    return NextResponse.json({ students });
  } catch {
    return NextResponse.json({ error: "Failed to load students" }, { status: 500 });
  }
}
