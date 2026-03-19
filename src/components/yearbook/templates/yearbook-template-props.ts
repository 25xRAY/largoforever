/**
 * Shared props for all yearbook visual templates (Classic lives outside this folder).
 */
export interface YearbookTemplateProps {
  displayName: string;
  headline?: string | null;
  tagline?: string | null;
  quote?: string | null;
  myStory?: string | null;
  favoriteQuote?: string | null;
  favoriteMemories?: string[];
  galleryPhotos?: string[];
  imageUrl?: string | null;
  /** Hex or CSS color for Bold template highlights; optional elsewhere */
  accentColor?: string | null;
}
