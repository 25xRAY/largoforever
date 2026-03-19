"use client";

import { getCanonicalUrl } from "@/lib/seo";

interface YearbookPageActionsProps {
  slug: string;
  viewCount: number;
}

/**
 * Share link and Print for yearbook page. Client-only for print().
 */
export function YearbookPageActions({ slug, viewCount }: YearbookPageActionsProps) {
  const url = getCanonicalUrl(`/yearbook/${slug}`);

  return (
    <footer className="mt-8 flex flex-wrap items-center gap-4 border-t border-navy-200 pt-6">
      <span className="text-sm text-navy-500">{viewCount} views</span>
      <a href={url} className="text-sm text-gold-600 hover:underline" target="_blank" rel="noopener noreferrer">
        Share link
      </a>
      <button type="button" onClick={() => window.print()} className="text-sm text-gold-600 hover:underline">
        Print
      </button>
    </footer>
  );
}
