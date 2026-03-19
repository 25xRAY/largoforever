"use client";

import Image from "next/image";
import type { YearbookTemplateProps } from "./yearbook-template-props";

/**
 * Swiss-influenced layout: clean sans-serif, left-aligned circular portrait, airy typography,
 * horizontal photo strip, muted palette and hairline borders on a light ground.
 */
export function MinimalistTemplate({
  displayName,
  headline,
  tagline,
  quote,
  myStory,
  favoriteQuote,
  favoriteMemories = [],
  galleryPhotos = [],
  imageUrl,
}: YearbookTemplateProps) {
  return (
    <article className="border border-navy-200 bg-navy-50/40 font-body text-navy-800">
      <div className="flex flex-col gap-10 px-6 py-10 sm:flex-row sm:items-start sm:gap-12 sm:px-10 sm:py-14">
        <div className="shrink-0">
          {imageUrl ? (
            <div className="relative h-40 w-40 overflow-hidden rounded-full border border-navy-200 sm:h-44 sm:w-44">
              <Image src={imageUrl} alt={displayName} fill className="object-cover" sizes="176px" />
            </div>
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full border border-navy-200 bg-white font-heading text-3xl font-semibold text-navy-400 sm:h-44 sm:w-44">
              {displayName.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-6">
          <header className="border-b border-navy-200 pb-6">
            <h1 className="font-heading text-2xl font-semibold uppercase tracking-[0.2em] text-navy-900 sm:text-3xl">
              {displayName}
            </h1>
            {(headline || tagline) && (
              <p className="mt-3 max-w-xl text-base leading-relaxed text-navy-600 sm:text-lg">
                {headline || tagline}
              </p>
            )}
          </header>
          {quote && (
            <blockquote className="border-l border-navy-300 pl-5 text-sm font-medium leading-loose text-navy-600 sm:text-base">
              {quote}
            </blockquote>
          )}
          {myStory && (
            <section className="max-w-2xl">
              <p className="text-base leading-[1.85] text-navy-700 sm:text-lg">{myStory}</p>
            </section>
          )}
          {favoriteQuote && (
            <p className="max-w-xl text-sm italic leading-loose text-navy-500">&ldquo;{favoriteQuote}&rdquo;</p>
          )}
        </div>
      </div>

      {galleryPhotos.length > 0 && (
        <div className="border-t border-navy-200 bg-white/60 py-6">
          <p className="mb-3 px-6 text-xs font-medium uppercase tracking-widest text-navy-500 sm:px-10">Gallery</p>
          <div className="flex gap-3 overflow-x-auto px-6 pb-2 sm:px-10 [scrollbar-width:thin]">
            {galleryPhotos.slice(0, 6).map((url, i) => (
              <div
                key={i}
                className="relative h-36 w-52 shrink-0 overflow-hidden border border-navy-200"
              >
                <Image src={url} alt="" fill className="object-cover" sizes="208px" />
              </div>
            ))}
          </div>
        </div>
      )}

      {favoriteMemories.length > 0 && (
        <div className="border-t border-navy-200 px-6 py-8 sm:px-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-navy-500">Memories</h2>
          <ul className="space-y-3 text-sm leading-relaxed text-navy-600">
            {favoriteMemories.map((m, i) => (
              <li key={i} className="flex gap-3 border-b border-navy-100 pb-3 last:border-0">
                <span className="font-mono text-xs text-navy-400">{String(i + 1).padStart(2, "0")}</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
