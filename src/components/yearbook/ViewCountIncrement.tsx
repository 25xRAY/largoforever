"use client";

import { useEffect, useRef } from "react";

/**
 * Calls GET /api/yearbook/[slug] with x-increment-view: true once on mount (client-side only).
 */
export function ViewCountIncrement({ slug }: { slug: string }) {
  const done = useRef(false);

  useEffect(() => {
    if (!slug || done.current) return;
    done.current = true;
    fetch(`/api/yearbook/${encodeURIComponent(slug)}`, {
      method: "GET",
      headers: { "x-increment-view": "true" },
      credentials: "same-origin",
    }).catch(() => {});
  }, [slug]);

  return null;
}
