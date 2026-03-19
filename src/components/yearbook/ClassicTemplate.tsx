"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ClassicTemplateProps {
  displayName: string;
  headline?: string | null;
  tagline?: string | null;
  quote?: string | null;
  myStory?: string | null;
  favoriteQuote?: string | null;
  favoriteMemories?: string[];
  galleryPhotos?: string[];
  imageUrl?: string | null;
}

/**
 * Traditional yearbook: large centered photo, Playfair name, drop-cap story, italic quote, 2x3 photo grid, memories list.
 */
export function ClassicTemplate({
  displayName,
  headline,
  tagline,
  quote,
  myStory,
  favoriteQuote,
  favoriteMemories = [],
  galleryPhotos = [],
  imageUrl,
}: ClassicTemplateProps) {
  const firstLetter = (myStory ?? "").charAt(0);
  const restStory = (myStory ?? "").slice(1);

  return (
    <article className="font-body text-navy-900">
      <div className="flex flex-col items-center py-8">
        {imageUrl ? (
          <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-gold-500">
            <Image src={imageUrl} alt={displayName} fill className="object-cover" sizes="256px" />
          </div>
        ) : (
          <div className="flex h-64 w-64 items-center justify-center rounded-full border-4 border-gold-500 bg-navy-100 font-heading text-5xl font-bold text-navy-500">
            {displayName.charAt(0)}
          </div>
        )}
        <h1 className="mt-6 font-accent text-4xl font-bold italic text-navy-900">{displayName}</h1>
        {(headline || tagline) && (
          <p className="mt-2 text-lg text-navy-600">{headline || tagline}</p>
        )}
      </div>

      {quote && (
        <blockquote className="my-8 border-l-4 border-gold-500 pl-6 font-accent text-xl italic text-navy-700">
          &ldquo;{quote}&rdquo;
        </blockquote>
      )}

      {myStory && (
        <section className="prose prose-navy max-w-none py-6">
          <p className="text-lg leading-relaxed">
            <span className="float-left mr-2 font-accent text-5xl font-bold text-gold-500">{firstLetter}</span>
            {restStory}
          </p>
        </section>
      )}

      {favoriteQuote && (
        <p className="my-6 text-center font-accent text-lg italic text-navy-600">&ldquo;{favoriteQuote}&rdquo;</p>
      )}

      {galleryPhotos.length > 0 && (
        <div className="my-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {galleryPhotos.slice(0, 6).map((url, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
              <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
            </div>
          ))}
        </div>
      )}

      {favoriteMemories.length > 0 && (
        <ul className="my-8 list-inside list-disc space-y-2 text-navy-700">
          {favoriteMemories.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
