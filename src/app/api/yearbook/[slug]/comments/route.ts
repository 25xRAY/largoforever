import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations/yearbook";

const RATE_LIMIT_PER_HOUR = 5;

/**
 * GET — public. Approved comments for this yearbook page.
 * POST — rate limited (5/hour per IP). Creates comment (PENDING moderation). Auth optional; if auth'd use session user.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.yearbookPage.findFirst({
    where: { slug },
    select: { id: true },
  });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const comments = await prisma.comment.findMany({
    where: { yearbookPageId: page.id, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  });

  const list = comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    authorName: c.user ? [c.user.firstName, c.user.lastName].filter(Boolean).join(" ") : "Guest",
  }));

  return NextResponse.json({ data: list });
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);

  const page = await prisma.yearbookPage.findFirst({
    where: { slug },
    select: { id: true },
  });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { authorName, message } = parsed.data;
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Sign in to leave a comment" }, { status: 401 });
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await prisma.comment.count({
      where: {
        userId,
        yearbookPageId: page.id,
        createdAt: { gte: oneHourAgo },
      },
    });
    if (recentCount >= RATE_LIMIT_PER_HOUR) {
      return NextResponse.json(
        { error: "Rate limit: 5 comments per hour per page" },
        { status: 429 }
      );
    }

    await prisma.comment.create({
      data: {
        userId,
        relation: "YEARBOOK_PAGE",
        yearbookPageId: page.id,
        content: message,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
