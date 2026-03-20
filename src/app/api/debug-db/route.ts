import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Unknown error";
}

/** TEMPORARY — remove before production. Dev-only DB connectivity probe. */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  try {
    const [accounts, users, roster] = await Promise.all([
      prisma.account.count(),
      prisma.user.count(),
      prisma.approvedRoster.count(),
    ]);
    return NextResponse.json({ ok: true, accounts, users, roster });
  } catch (e: unknown) {
    const message = errorMessage(e);
    logger.error("debug-db: query failed", { error: message });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
