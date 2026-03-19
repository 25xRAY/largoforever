"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { YearbookTemplateProps } from "./yearbook-template-props";

/**
 * Craft / yearbook-scrapbook aesthetic: paper-like panel, taped portrait, tilted polaroids,
 * handwriting accents, sticker chips, warm shadows.
 */
export function ScrapbookTemplate({
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
    <article
      className={cn(
        "relative overflow-hidden rounded-lg border-2 border-navy-200/80 px-5 py-8 font-body text-navy-900 shadow-inner sm:px-8 sm:py-10",
        "bg-gold-50"
      )}
      style={{
        backgroundImage: `
          linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 40%),
          repeating-linear-gradient(
            transparent,
            transparent 27px,
            rgba(0, 59, 122, 0.06) 27px,
            rgba(0, 59, 122, 0.06) 28px
          )
        `,
      }}
    >
      <div className="relative mx-auto max-w-xl text-center">
        <div className="relative mx-auto inline-block">
          {imageUrl ? (
            <div
              className={cn(
                "relative h-48 w-48 overflow-hidden bg-white p-2 shadow-[4px_6px_0_rgba(0,59,122,0.12),8px_10px_24px_rgba(0,0,0,0.08)] sm:h-52 sm:w-52",
                "-rotate-2"
              )}
            >
              <div
                className="absolute -left-1 top-3 z-[2] h-6 w-14 -rotate-6 bg-gold-200/90 shadow-sm"
                aria-hidden
              />
              <div
                className="absolute -right-2 top-5 z-[2] h-6 w-12 rotate-12 bg-gold-200/90 shadow-sm"
                aria-hidden
              />
              <Image src={imageUrl} alt={displayName} fill className="object-cover" sizes="208px" />
            </div>
          ) : (
            <div
              className={cn(
                "flex h-48 w-48 items-center justify-center bg-white p-2 font-accent text-5xl font-bold text-navy-400 shadow-[4px_6px_0_rgba(0,59,122,0.12)] sm:h-52 sm:w-52",
                "-rotate-2"
              )}
            >
              {displayName.charAt(0)}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-block rotate-[-3deg] rounded-md border-2 border-navy-300 bg-warning/25 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wide text-navy-800 shadow-sm">
            Class of &apos;26
          </span>
          <span className="inline-block rotate-[2deg] rounded-full border-2 border-danger/40 bg-danger-light/40 px-3 py-1 font-heading text-xs font-semibold text-navy-800 shadow-sm">
            Largo Lion
          </span>
        </div>

        <h1 className="mt-6 font-accent text-3xl font-bold italic text-navy-900 sm:text-4xl">{displayName}</h1>
        {(headline || tagline) && (
          <p className="mt-2 font-accent text-lg text-navy-700">{headline || tagline}</p>
        )}
      </div>

      {quote && (
        <blockquote className="mx-auto mt-8 max-w-lg rounded-lg border-2 border-dashed border-navy-300 bg-white/70 p-4 text-center font-accent text-lg italic text-navy-700 shadow-md">
          &ldquo;{quote}&rdquo;
        </blockquote>
      )}

      {myStory && (
        <section className="mx-auto mt-8 max-w-2xl">
          <p className="text-base leading-loose text-navy-800 sm:text-lg">{myStory}</p>
        </section>
      )}

      {favoriteQuote && (
        <p className="mx-auto mt-8 max-w-lg text-center font-accent text-xl italic text-navy-600">
          ✎ &ldquo;{favoriteQuote}&rdquo;
        </p>
      )}

      {galleryPhotos.length > 0 && (
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {galleryPhotos.slice(0, 6).map((url, i) => {
            const tilt = i % 3 === 0 ? "-rotate-3" : i % 3 === 1 ? "rotate-2" : "-rotate-1";
            return (
              <div
                key={i}
                className={cn(
                  "relative w-[42%] max-w-[200px] bg-white p-2 shadow-[3px_5px_0_rgba(0,59,122,0.15),6px_8px_20px_rgba(0,0,0,0.1)] sm:w-[30%]",
                  tilt
                )}
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image src={url} alt="" fill className="object-cover" sizes="200px" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {favoriteMemories.length > 0 && (
        <ul className="mx-auto mt-10 max-w-xl space-y-3">
          {favoriteMemories.map((m, i) => (
            <li
              key={i}
              className="rounded-md border border-navy-200 bg-white/80 px-4 py-3 text-navy-800 shadow-sm"
              style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
            >
              <span className="mr-2 font-accent text-sm font-bold text-gold-600">♥</span>
              {m}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
