import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { yearbookPageSchema } from "@/lib/validations/yearbook";
import { generateSlug } from "@/lib/utils";

const DEFAULT_LIMIT = 20;

/**
 * GET — public. Paginated approved+published yearbook pages.
 * POST — authenticated. Create page (one per student). Enforce unique userId.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10));
  const search = searchParams.get("search")?.trim();
  const skip = (page - 1) * limit;

  const where = {
    status: "APPROVED" as const,
    publishedAt: { not: null },
    ...(search && {
      OR: [
        { displayName: { contains: search, mode: "insensitive" as const } },
        { headline: { contains: search, mode: "insensitive" as const } },
        { tagline: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [pages, total] = await Promise.all([
    prisma.yearbookPage.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        slug: true,
        displayName: true,
        headline: true,
        tagline: true,
        imageUrl: true,
        template: true,
        publishedAt: true,
        user: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.yearbookPage.count({ where }),
  ]);

  return NextResponse.json({
    data: pages.map((p) => ({
      ...p,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      displayName:
        p.displayName ??
        (p.user ? [p.user.firstName, p.user.lastName].filter(Boolean).join(" ") : null),
    })),
    total,
    page,
    limit,
    hasMore: skip + pages.length < total,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id as string;

  const existing = await prisma.yearbookPage.findUnique({
    where: { userId },
  });
  if (existing) {
    return NextResponse.json(
      { error: "You already have a yearbook page. Use PATCH to update." },
      { status: 409 }
    );
  }

  try {
    const body = await request.json();
    const parsed = yearbookPageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const displayName =
      data.displayName ??
      [session.user.firstName, session.user.lastName].filter(Boolean).join(" ") ??
      "Student";
    const slug = generateSlug(displayName) || userId.slice(0, 8);
    const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

    const page = await prisma.yearbookPage.create({
      data: {
        userId,
        slug: uniqueSlug,
        displayName: data.displayName ?? null,
        headline: data.headline ?? null,
        tagline: data.tagline ?? null,
        quote: data.quote ?? null,
        myStory: data.myStory ?? null,
        favoriteQuote: data.favoriteQuote ?? null,
        favoriteMemories: data.favoriteMemories ? JSON.stringify(data.favoriteMemories) : null,
        galleryPhotos: data.galleryPhotos ? JSON.stringify(data.galleryPhotos) : null,
        template:
          (data.template as "CLASSIC" | "MODERN" | "MINIMAL" | "BOLD" | "SCRAPBOOK") ?? "CLASSIC",
        layout: (data.layout as "SINGLE" | "GALLERY" | "STORY") ?? "SINGLE",
        imageUrl: data.imageUrl ?? null,
        accentColor: data.accentColor ?? null,
        cashappHandle: data.cashappHandle ?? null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      id: page.id,
      slug: page.slug,
      status: page.status,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create yearbook page" }, { status: 500 });
  }
}
