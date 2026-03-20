import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AdministratorTitle, TeacherDepartment, type Prisma } from "@prisma/client";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const teacherDept = z.union([z.nativeEnum(TeacherDepartment), z.literal(""), z.null()]).optional();
const adminTitle = z
  .union([z.nativeEnum(AdministratorTitle), z.literal(""), z.null()])
  .optional();

const patchSchema = z
  .object({
    firstName: z.string().max(128).optional(),
    lastName: z.string().max(128).optional(),
    preferredName: z.string().max(50).optional().nullable(),
    pronouns: z.string().max(30).optional().nullable(),
    image: z.union([z.string().max(512), z.literal("")]).optional().nullable(),
    seniorGoalsNote: z.string().max(512).optional().nullable(),
    yearbookPublic: z.boolean().optional(),
    leaderboardOptIn: z.boolean().optional(),
    displayGpa: z.union([z.number().min(0).max(5), z.null()]).optional(),
    apIbCourseCount: z.number().int().min(0).max(20).optional(),
    leadershipRolesJson: z.string().max(16_000).optional().nullable(),
    teacherDepartment: teacherDept,
    teacherSubject: z.string().max(256).optional().nullable(),
    administratorTitle: adminTitle,
    administratorOffice: z.string().max(256).optional().nullable(),
  })
  .strict();

function normalizeOptionalString(s: string | null | undefined): string | undefined | null {
  if (s === undefined) return undefined;
  if (s === null) return null;
  const t = s.trim();
  return t === "" ? null : t;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        preferredName: true,
        pronouns: true,
        image: true,
        role: true,
        seniorGoalsNote: true,
        graduationYear: true,
        yearbookPublic: true,
        leaderboardOptIn: true,
        displayGpa: true,
        apIbCourseCount: true,
        leadershipRolesJson: true,
        honorDesignation: true,
        teacherDepartment: true,
        teacherSubject: true,
        administratorTitle: true,
        administratorOffice: true,
        profileComplete: true,
        createdAt: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json: unknown = await req.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const body = parsed.data;
    const data: Prisma.UserUpdateInput = {};

    if (body.firstName !== undefined) data.firstName = body.firstName;
    if (body.lastName !== undefined) data.lastName = body.lastName;
    if (body.preferredName !== undefined) data.preferredName = normalizeOptionalString(body.preferredName);
    if (body.pronouns !== undefined) data.pronouns = normalizeOptionalString(body.pronouns);
    if (body.image !== undefined) {
      data.image = body.image === "" || body.image === null ? null : body.image;
    }
    if (body.seniorGoalsNote !== undefined)
      data.seniorGoalsNote = normalizeOptionalString(body.seniorGoalsNote) ?? null;
    if (body.yearbookPublic !== undefined) data.yearbookPublic = body.yearbookPublic;
    if (body.leaderboardOptIn !== undefined) data.leaderboardOptIn = body.leaderboardOptIn;
    if (body.displayGpa !== undefined) data.displayGpa = body.displayGpa;
    if (body.apIbCourseCount !== undefined) data.apIbCourseCount = body.apIbCourseCount;
    if (body.leadershipRolesJson !== undefined)
      data.leadershipRolesJson = normalizeOptionalString(body.leadershipRolesJson);
    if (body.teacherSubject !== undefined)
      data.teacherSubject = normalizeOptionalString(body.teacherSubject);
    if (body.administratorOffice !== undefined)
      data.administratorOffice = normalizeOptionalString(body.administratorOffice);

    if (body.teacherDepartment !== undefined) {
      data.teacherDepartment =
        body.teacherDepartment === "" || body.teacherDepartment === null
          ? null
          : body.teacherDepartment;
    }

    if (body.administratorTitle !== undefined) {
      data.administratorTitle =
        body.administratorTitle === "" || body.administratorTitle === null
          ? null
          : body.administratorTitle;
    }

    const current = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { firstName: true, lastName: true },
    });
    const resolvedFirst = (
      body.firstName !== undefined ? body.firstName : (current?.firstName ?? "")
    ).trim();
    const resolvedLast = (
      body.lastName !== undefined ? body.lastName : (current?.lastName ?? "")
    ).trim();
    if (resolvedFirst !== "" || resolvedLast !== "") {
      data.name = `${resolvedFirst} ${resolvedLast}`.trim();
    }
    data.profileComplete = resolvedFirst !== "" && resolvedLast !== "";

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        preferredName: true,
        pronouns: true,
        image: true,
        seniorGoalsNote: true,
        yearbookPublic: true,
        leaderboardOptIn: true,
        profileComplete: true,
        teacherDepartment: true,
        teacherSubject: true,
        administratorTitle: true,
        administratorOffice: true,
        displayGpa: true,
        apIbCourseCount: true,
        leadershipRolesJson: true,
      },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
