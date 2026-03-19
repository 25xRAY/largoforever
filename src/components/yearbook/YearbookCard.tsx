"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface YearbookCardProps {
  slug: string;
  displayName: string | null;
  headline: string | null;
  tagline: string | null;
  imageUrl: string | null;
  template: string;
}

/**
 * Grid card: profile photo or Avatar, display name, tagline, template indicator. Hover: scale + "View Page →".
 */
export function YearbookCard({
  slug,
  displayName,
  headline,
  tagline,
  imageUrl,
  template,
}: YearbookCardProps) {
  const name = displayName || headline || "A Largo Lion";

  return (
    <Link
      href={`/yearbook/${slug}`}
      className={cn(
        "group block overflow-hidden rounded-card border-2 border-navy-200 bg-white shadow-card transition-all",
        "hover:scale-[1.02] hover:border-gold-500 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-gold-500"
      )}
    >
      <div className="aspect-[4/3] relative bg-navy-100 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <Avatar size="xl" name={name} showRing />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-navy-900">{name}</h3>
        {tagline && <p className="mt-1 text-sm text-navy-600 line-clamp-2">{tagline}</p>}
        <p className="mt-2 text-sm font-medium text-gold-600 opacity-0 transition-opacity group-hover:opacity-100">
          View Page →
        </p>
      </div>
    </Link>
  );
}
