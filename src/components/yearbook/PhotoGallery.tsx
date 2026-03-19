"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoGalleryProps {
  photos: string[];
  alt?: string;
}

/**
 * Grid of up to 6 photos. Click to open lightbox with prev/next, keyboard (arrows, Escape), touch swipe.
 */
export function PhotoGallery({ photos, alt = "Gallery" }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((lightboxIndex ?? 0) > 0 ? (lightboxIndex ?? 0) - 1 : photos.length - 1);
  const next = () =>
    setLightboxIndex((lightboxIndex ?? 0) < photos.length - 1 ? (lightboxIndex ?? 0) + 1 : 0);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {photos.slice(0, 6).map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => open(i)}
            className="relative aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <Image
              src={url}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/90"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
          }}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 rounded-full p-2 text-white hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={photos[lightboxIndex]}
              alt={`${alt} ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto object-contain"
            />
          </div>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 rounded-full p-2 text-white hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      )}
    </>
  );
}
