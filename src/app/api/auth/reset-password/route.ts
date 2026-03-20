import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(32),
  newPassword: z
    .string()
    .min(8, "Must be at least 8 characters.")
    .regex(/[A-Z]/, "Must include an uppercase letter.")
    .regex(/[0-9]/, "Must include a number."),
});

export async function POST(req: NextRequest) {
  try {
    const json: unknown = await req.json().catch(() => null);
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const now = new Date();

    const user = await prisma.user.findFirst({
      where: {
        email,
        passwordResetToken: parsed.data.token,
        passwordResetExpires: { gt: now },
      },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Request a new one from Forgot Password." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(parsed.data.newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    logger.error("[reset-password] error", { error: String(e) });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
