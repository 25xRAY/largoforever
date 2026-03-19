import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getYearbookPageBySlug, getYearbookCommentsBySlug } from "@/lib/yearbook";
import { generatePageMetadata, getCanonicalUrl } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { CommentSection, ViewCountIncrement, YearbookPageActions, YearbookTemplateView } from "@/components/yearbook";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const rows = await prisma.yearbookPage.findMany({
    where: {
      status: "APPROVED",
      publishedAt: { not: null },
      slug: { not: null },
    },
    select: { slug: true },
  });
  return rows
    .filter((r): r is { slug: string } => r.slug != null && r.slug.length > 0)
    .map((r) => ({ slug: r.slug! }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const page = await getYearbookPageBySlug(slug, session?.user?.id as string | undefined);
  if (!page) return { title: "Not Found" };
  const title = `${page.displayName ?? "Largo Lion"} — Class of 2026 Yearbook`;
  const description = page.tagline ?? page.headline ?? "Largo Lions Class of 2026 Digital Yearbook.";
  const base = generatePageMetadata({
    title,
    description,
    path: `/yearbook/${slug}`,
    image: page.imageUrl ?? undefined,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "profile",
    },
  };
}

export default async function YearbookSlugPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string | undefined;

  const [page, comments] = await Promise.all([
    getYearbookPageBySlug(slug, userId),
    getYearbookCommentsBySlug(slug),
  ]);

  if (!page) notFound();

  const displayName = page.displayName ?? "A Largo Lion";
  const shareTitle = `${displayName} — Class of 2026 Yearbook`;
  const rawImage = page.imageUrl?.trim();
  const profilePhotoAbsolute =
    rawImage && (rawImage.startsWith("http://") || rawImage.startsWith("https://"))
      ? rawImage
      : rawImage
        ? getCanonicalUrl(rawImage.startsWith("/") ? rawImage : `/${rawImage}`)
        : undefined;
  const personDescription = page.tagline ?? page.headline ?? undefined;

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: getCanonicalUrl(`/yearbook/${slug}`),
    mainEntity: {
      "@type": "Person",
      name: displayName,
      ...(personDescription ? { description: personDescription } : {}),
      ...(profilePhotoAbsolute ? { image: profilePhotoAbsolute } : {}),
    },
  } as Record<string, unknown>;

  const commentsForSection = comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    authorName: c.authorName,
  }));

  const isBold = page.template === "BOLD";

  const templateBody = (
    <YearbookTemplateView
      template={page.template}
      displayName={displayName}
      headline={page.headline}
      tagline={page.tagline}
      quote={page.quote}
      myStory={page.myStory}
      favoriteQuote={page.favoriteQuote}
      favoriteMemories={page.favoriteMemories}
      galleryPhotos={page.galleryPhotos}
      imageUrl={page.imageUrl}
      accentColor={page.accentColor}
    />
  );

  return (
    <div className={cn("mx-auto px-4 py-8", isBold ? "max-w-5xl" : "max-w-3xl")}>
      <JsonLd data={profileJsonLd} />
      <ViewCountIncrement slug={slug} />
      <Link href="/yearbook" className="text-gold-600 hover:underline text-sm">
        ← Back to Yearbook
      </Link>

      {isBold ? (
        <>
          <article className="mt-8 overflow-hidden rounded-card border-0 bg-transparent p-0 shadow-card">
            {templateBody}
          </article>
          <div className="mt-4 rounded-card border-2 border-navy-200 bg-white px-6 py-4 shadow-card sm:px-8">
            <YearbookPageActions slug={slug} viewCount={page.viewCount} shareTitle={shareTitle} />
          </div>
        </>
      ) : (
        <article className="mt-8 rounded-card border-2 border-navy-200 bg-white p-8 shadow-card">
          {templateBody}
          <YearbookPageActions slug={slug} viewCount={page.viewCount} shareTitle={shareTitle} />
        </article>
      )}

      <CommentSection slug={slug} comments={commentsForSection} />
    </div>
  );
}
