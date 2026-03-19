import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { UserRole } from "@prisma/client";

/** Staff roles allowed in admin panel. */
export async function requireStaffSession(): Promise<
  { ok: true; userId: string; role: UserRole } | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = session.user.role;
  if (role !== "ADMIN" && role !== "MODERATOR") {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, userId: session.user.id, role };
}

export async function requireAdminSession(): Promise<
  { ok: true; userId: string; role: UserRole } | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "ADMIN") {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, userId: session.user.id, role: session.user.role };
}
