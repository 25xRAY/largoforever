import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getYearbookPageBySlug, getYearbookCommentsBySlug } from "@/lib/yearbook";
import { generatePageMetadata } from "@/lib/seo";
import { ClassicTemplate, CommentSection, ViewCountIncrement, YearbookPageActions } from "@/components/yearbook";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Pre-render no slugs; all pages generated on demand. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const page = await getYearbookPageBySlug(slug, session?.user?.id as string | undefined);
  if (!page) return { title: "Not Found" };
  const title = `${page.displayName ?? "Largo Lion"} — Class of 2026 Yearbook`;
  const description = page.tagline ?? page.headline ?? "Largo Lions Class of 2026 Digital Yearbook.";
  return generatePageMetadata({
    title,
    description,
    path: `/yearbook/${slug}`,
    image: page.imageUrl ?? undefined,
  });
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
  const commentsForSection = comments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    authorName: c.authorName,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <ViewCountIncrement slug={slug} />
      <Link href="/yearbook" className="text-gold-600 hover:underline text-sm">
        ← Back to Yearbook
      </Link>

      <article className="mt-8 rounded-card border-2 border-navy-200 bg-white p-8 shadow-card">
        <ClassicTemplate
          displayName={displayName}
          headline={page.headline}
          tagline={page.tagline}
          quote={page.quote}
          myStory={page.myStory}
          favoriteQuote={page.favoriteQuote}
          favoriteMemories={page.favoriteMemories}
          galleryPhotos={page.galleryPhotos}
          imageUrl={page.imageUrl}
        />
        <YearbookPageActions slug={slug} viewCount={page.viewCount} />
      </article>

      <CommentSection slug={slug} comments={commentsForSection} />
    </div>
  );
}
