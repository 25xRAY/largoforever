import { z } from "zod";

const templateEnum = z.enum(["CLASSIC", "MODERN", "MINIMAL", "BOLD", "SCRAPBOOK"]);
const layoutEnum = z.enum(["SINGLE", "GALLERY", "STORY"]);
const relationshipEnum = z.enum(["FRIEND", "FAMILY", "TEACHER", "CLASSMATE", "OTHER"]);

export const yearbookPageSchema = z.object({
  displayName: z.string().max(100).optional().nullable(),
  headline: z.string().max(256).optional().nullable(),
  tagline: z.string().max(100).optional().nullable(),
  quote: z.string().max(512).optional().nullable(),
  myStory: z.string().max(1500).optional().nullable(),
  favoriteQuote: z.string().max(250).optional().nullable(),
  favoriteMemories: z.array(z.string().max(200)).max(10).optional().nullable(),
  galleryPhotos: z.array(z.string().url()).max(6).optional().nullable(),
  template: templateEnum.optional(),
  layout: layoutEnum.optional(),
  imageUrl: z.string().url().optional().nullable(),
  accentColor: z.string().max(20).optional().nullable(),
  cashappHandle: z
    .string()
    .regex(/^$|^[\w]+$/)
    .max(50)
    .optional()
    .nullable(),
});

export type YearbookPageInput = z.infer<typeof yearbookPageSchema>;

export const commentSchema = z.object({
  authorName: z.string().min(1).max(100),
  authorRelationship: relationshipEnum,
  message: z.string().min(1).max(500),
  parentCommentId: z.string().uuid().optional().nullable(),
});

export type CommentInput = z.infer<typeof commentSchema>;
