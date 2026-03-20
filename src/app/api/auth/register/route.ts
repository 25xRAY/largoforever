import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { normalizeRosterEmail } from "@/lib/roster";
import { LOGIN_QUERY_ERROR_MESSAGES } from "@/lib/login-error-messages";

const BCRYPT_ROUNDS = 12;

/**
 * POST /api/auth/register — validate with registerSchema, check duplicate email, hash password, create User (STUDENT).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName } = parsed.data;
    const emailNorm = normalizeRosterEmail(email);

    const rosterEntry = await prisma.approvedRoster.findUnique({
      where: { email: emailNorm },
    });

    if (!rosterEntry) {
      return NextResponse.json(
        { error: LOGIN_QUERY_ERROR_MESSAGES.NotOnRoster },
        { status: 403 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: emailNorm },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: emailNorm,
          password: hashedPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          name: `${firstName.trim()} ${lastName.trim()}`,
          role: rosterEntry.role,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });
      await tx.approvedRoster.update({
        where: { id: rosterEntry.id },
        data: { used: true },
      });
      return created;
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    logger.error("Registration failed", { error: String(err) });
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
