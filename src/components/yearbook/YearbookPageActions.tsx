"use client";

import { useState } from "react";
import { getCanonicalUrl } from "@/lib/seo";

interface YearbookPageActionsProps {
  slug: string;
  viewCount: number;
  /** Used for Twitter/X intent text */
  shareTitle: string;
}

/**
 * Views, copy link, Twitter/X, Facebook, print. Client-only for clipboard and window.open.
 */
export function YearbookPageActions({ slug, viewCount, shareTitle }: YearbookPageActionsProps) {
  const url = getCanonicalUrl(`/yearbook/${slug}`);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(shareTitle);
    const u = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${u}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <footer className="mt-8 flex flex-wrap items-center gap-4 border-t border-navy-200 pt-6">
      <span className="text-sm text-navy-500">{viewCount} views</span>
      <button
        type="button"
        onClick={copyLink}
        className="text-sm font-medium text-gold-600 hover:text-gold-700 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={shareTwitter}
        className="text-sm font-medium text-gold-600 hover:text-gold-700 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
      >
        Share on X
      </button>
      <button
        type="button"
        onClick={shareFacebook}
        className="text-sm font-medium text-gold-600 hover:text-gold-700 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
      >
        Share on Facebook
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="text-sm text-gold-600 hover:underline"
      >
        Print
      </button>
    </footer>
  );
}
