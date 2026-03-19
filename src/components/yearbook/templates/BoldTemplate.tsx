"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { YearbookTemplateProps } from "./yearbook-template-props";

const HEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

function resolveAccent(accentColor: string | null | undefined): string | null {
  if (accentColor && HEX.test(accentColor.trim())) return accentColor.trim();
  return null;
}

/**
 * High-energy layout: full-bleed hero portrait, oversized name overlay, accent-driven accents,
 * bold story type, masonry-style photo collage.
 */
export function BoldTemplate({
  displayName,
  headline,
  tagline,
  quote,
  myStory,
  favoriteQuote,
  favoriteMemories = [],
  galleryPhotos = [],
  imageUrl,
  accentColor,
}: YearbookTemplateProps) {
  const accentHex = resolveAccent(accentColor);

  return (
    <article
      className="font-body text-white"
      style={
        accentHex
          ? ({
              "--yb-accent": accentHex,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div className="relative min-h-[320px] w-full overflow-hidden sm:min-h-[420px]">
        {imageUrl ? (
          <>
            <Image src={imageUrl} alt="" fill className="object-cover" sizes="100vw" priority />
            <div
              className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/30"
              aria-hidden
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-navy-800" aria-hidden />
        )}
        <div className="relative z-[1] flex min-h-[320px] flex-col justify-end px-6 pb-10 pt-24 sm:min-h-[420px] sm:px-10 sm:pb-14">
          <h1
            className="font-heading text-4xl font-extrabold leading-none tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] sm:text-6xl md:text-7xl"
            style={{ textShadow: "0 2px 32px rgba(0,0,0,0.9)" }}
          >
            {displayName}
          </h1>
          {(headline || tagline) && (
            <p className="mt-4 max-w-xl text-lg font-semibold text-white/95 drop-shadow-md sm:text-xl">
              {headline || tagline}
            </p>
          )}
          <div
            className={cn("mt-6 h-1 w-24 rounded-full sm:w-32", !accentHex && "bg-gold-500")}
            style={accentHex ? { backgroundColor: "var(--yb-accent)" } : undefined}
          />
        </div>
      </div>

      <div className="bg-navy-900 px-6 py-10 sm:px-10">
        {quote && (
          <blockquote
            className={cn(
              "border-l-4 pl-5 text-xl font-bold leading-snug text-white/95 sm:text-2xl",
              !accentHex && "border-gold-500"
            )}
            style={accentHex ? { borderColor: "var(--yb-accent)" } : undefined}
          >
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}

        {myStory && (
          <section className={cn("mt-10", quote && "mt-12")}>
            <p className="text-xl font-medium leading-relaxed text-white/90 sm:text-2xl sm:leading-relaxed">
              {myStory}
            </p>
          </section>
        )}

        {favoriteQuote && (
          <p
            className={cn(
              "mt-10 text-center text-lg font-bold sm:text-xl",
              !accentHex && "text-gold-500"
            )}
            style={accentHex ? { color: "var(--yb-accent)" } : undefined}
          >
            &ldquo;{favoriteQuote}&rdquo;
          </p>
        )}

        {galleryPhotos.length > 0 && (
          <div className="mt-12 columns-2 gap-3 sm:columns-3 sm:gap-4">
            {galleryPhotos.slice(0, 6).map((url, i) => (
              <div
                key={i}
                className="relative mb-3 break-inside-avoid overflow-hidden rounded-lg border-2 border-white/20 shadow-lg sm:mb-4"
                style={{ transform: i % 2 === 1 ? "rotate(1deg)" : "rotate(-0.5deg)" }}
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 45vw, 30vw"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {favoriteMemories.length > 0 && (
          <ul className="mt-12 space-y-3 border-t border-white/20 pt-10">
            {favoriteMemories.map((m, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg bg-white/5 px-4 py-3 text-base font-semibold text-white/90"
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-navy-900",
                    !accentHex && "bg-gold-500"
                  )}
                  style={accentHex ? { backgroundColor: "var(--yb-accent)" } : undefined}
                >
                  {i + 1}
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
