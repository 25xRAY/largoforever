import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ALLOWED = new Set(["json", "static", "pdf"]);

/**
 * POST /api/admin/archive — admin only. Placeholder for JSON/static/PDF class exports (future).
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.type || !ALLOWED.has(body.type)) {
    return NextResponse.json({ error: "type must be one of: json, static, pdf" }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: "Archive generation is not yet available in this build.",
      downloadUrl: null as string | null,
    },
    { status: 202 }
  );
}
