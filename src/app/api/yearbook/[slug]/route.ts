import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { yearbookPageSchema } from "@/lib/validations/yearbook";

/**
 * GET — public if approved+published or owner. Increment viewCount (debounced by caller).
 * PATCH — authenticated owner only.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string | undefined;

  const page = await prisma.yearbookPage.findFirst({
    where: { slug, OR: [{ status: "APPROVED", publishedAt: { not: null } }, { userId: userId ?? "" }] },
    include: {
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = userId && page.userId === userId;
  const isPublic = page.status === "APPROVED" && page.publishedAt;
  if (!isPublic && !isOwner) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const viewCountIncrement = request.headers.get("x-increment-view") === "true";
  if (viewCountIncrement && (isPublic || isOwner)) {
    await prisma.yearbookPage.update({
      where: { id: page.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  const payload = {
    ...page,
    publishedAt: page.publishedAt?.toISOString() ?? null,
    favoriteMemories: page.favoriteMemories ? (JSON.parse(page.favoriteMemories) as string[]) : [],
    galleryPhotos: page.galleryPhotos ? (JSON.parse(page.galleryPhotos) as string[]) : [],
    user: page.user,
  };

  return NextResponse.json(payload);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const page = await prisma.yearbookPage.findFirst({
    where: { slug, userId: session.user.id as string },
  });

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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
    const update: Record<string, unknown> = {};
    if (data.displayName !== undefined) update.displayName = data.displayName;
    if (data.headline !== undefined) update.headline = data.headline;
    if (data.tagline !== undefined) update.tagline = data.tagline;
    if (data.quote !== undefined) update.quote = data.quote;
    if (data.myStory !== undefined) update.myStory = data.myStory;
    if (data.favoriteQuote !== undefined) update.favoriteQuote = data.favoriteQuote;
    if (data.favoriteMemories !== undefined) update.favoriteMemories = JSON.stringify(data.favoriteMemories ?? []);
    if (data.galleryPhotos !== undefined) update.galleryPhotos = JSON.stringify(data.galleryPhotos ?? []);
    if (data.template !== undefined) update.template = data.template;
    if (data.layout !== undefined) update.layout = data.layout;
    if (data.imageUrl !== undefined) update.imageUrl = data.imageUrl;
    if (data.accentColor !== undefined) update.accentColor = data.accentColor;
    if (data.cashappHandle !== undefined) update.cashappHandle = data.cashappHandle;

    const updated = await prisma.yearbookPage.update({
      where: { id: page.id },
      data: update,
    });

    return NextResponse.json({
      id: updated.id,
      slug: updated.slug,
      status: updated.status,
    });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
