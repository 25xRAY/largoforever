"use client";

import type { YearbookTemplateProps } from "./yearbook-template-props";
import { ClassicTemplate } from "../ClassicTemplate";
import { MinimalistTemplate } from "./MinimalistTemplate";
import { BoldTemplate } from "./BoldTemplate";
import { ScrapbookTemplate } from "./ScrapbookTemplate";

export type YearbookTemplateKey = "CLASSIC" | "MODERN" | "MINIMAL" | "BOLD" | "SCRAPBOOK";

interface YearbookTemplateViewProps extends YearbookTemplateProps {
  template: string;
}

/**
 * Renders the yearbook page body for the stored Prisma template enum value.
 * MODERN shares the Swiss minimal layout (distinct from Classic).
 */
export function YearbookTemplateView({ template, ...props }: YearbookTemplateViewProps) {
  const key = template.toUpperCase() as YearbookTemplateKey;

  switch (key) {
    case "MINIMAL":
    case "MODERN":
      return <MinimalistTemplate {...props} />;
    case "BOLD":
      return <BoldTemplate {...props} />;
    case "SCRAPBOOK":
      return <ScrapbookTemplate {...props} />;
    case "CLASSIC":
    default:
      return <ClassicTemplate {...props} />;
  }
}
