import { prisma } from "./prisma";

export interface YearbookPagePublic {
  id: string;
  slug: string | null;
  displayName: string | null;
  headline: string | null;
  tagline: string | null;
  quote: string | null;
  myStory: string | null;
  favoriteQuote: string | null;
  favoriteMemories: string[];
  galleryPhotos: string[];
  template: string;
  imageUrl: string | null;
  viewCount: number;
}

/**
 * Fetch a yearbook page by slug. Public (approved + published) or owner only.
 * Does not increment view count.
 */
export async function getYearbookPageBySlug(
  slug: string,
  userId?: string | null
): Promise<YearbookPagePublic | null> {
  const page = await prisma.yearbookPage.findFirst({
    where: {
      slug,
      OR: [
        { status: "APPROVED", publishedAt: { not: null } },
        ...(userId ? [{ userId }] : []),
      ],
    },
    include: {
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!page) return null;

  const isOwner = userId && page.userId === userId;
  const isPublic = page.status === "APPROVED" && page.publishedAt != null;
  if (!isPublic && !isOwner) return null;

  return {
    id: page.id,
    slug: page.slug,
    displayName: page.displayName ?? (page.user ? [page.user.firstName, page.user.lastName].filter(Boolean).join(" ") : null),
    headline: page.headline,
    tagline: page.tagline,
    quote: page.quote,
    myStory: page.myStory,
    favoriteQuote: page.favoriteQuote,
    favoriteMemories: page.favoriteMemories ? (JSON.parse(page.favoriteMemories) as string[]) : [],
    galleryPhotos: page.galleryPhotos ? (JSON.parse(page.galleryPhotos) as string[]) : [],
    template: page.template,
    imageUrl: page.imageUrl,
    viewCount: page.viewCount,
  };
}

export interface YearbookCommentPublic {
  id: string;
  content: string;
  createdAt: Date;
  authorName: string;
}

/**
 * Fetch approved comments for a yearbook page by slug.
 */
export async function getYearbookCommentsBySlug(slug: string): Promise<YearbookCommentPublic[]> {
  const page = await prisma.yearbookPage.findFirst({
    where: { slug },
    select: { id: true },
  });
  if (!page) return [];

  const comments = await prisma.comment.findMany({
    where: { yearbookPageId: page.id, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  });

  return comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    authorName: c.user ? [c.user.firstName, c.user.lastName].filter(Boolean).join(" ") : "Guest",
  }));
}
