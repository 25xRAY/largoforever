"use client";

import Link from "next/link";
import { ClipboardCheck, Trophy, BookOpen, Sparkles, Calendar } from "lucide-react";
import { COUNSELOR_INFO } from "@/lib/constants";

interface QuickActionsProps {
  /** If set, show "View Your Page" linking to /yearbook/[slug]; otherwise "Complete Yearbook" → /dashboard/yearbook/edit */
  yearbookSlug?: string | null;
}

const ACTIONS = [
  {
    href: "/dashboard/checklist",
    icon: ClipboardCheck,
    title: "View Checklist",
    description: "See your full graduation progress",
  },
  {
    href: "/dashboard/wall-of-wins/submit",
    icon: Trophy,
    title: "Submit Win",
    description: "Share a scholarship or acceptance",
  },
  {
    href: "/dashboard/yearbook/edit",
    icon: BookOpen,
    title: "Complete Yearbook",
    description: "Create your digital yearbook page",
  },
  {
    href: "/dashboard/ed-roniq",
    icon: Sparkles,
    title: "Talk to Ed RonIQ",
    description: "Get answers about graduation",
  },
  {
    href: COUNSELOR_INFO.calendly,
    icon: Calendar,
    title: "Schedule Counselor",
    description: "Book time with Tomeco Dates",
    external: true,
  },
];

/**
 * 5 cards: View Checklist, Submit Win, Yearbook (or View Your Page), Ed RonIQ, Schedule Counselor. Hover: gold accent.
 */
export function QuickActions({ yearbookSlug }: QuickActionsProps) {
  const actions = ACTIONS.map((a) =>
    a.title === "Complete Yearbook" && yearbookSlug
      ? {
          ...a,
          href: `/yearbook/${yearbookSlug}`,
          title: "View Your Page",
          description: "See your yearbook page",
        }
      : a
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {actions.map((action) => {
        const Icon = action.icon;
        const content = (
          <>
            <Icon className="h-8 w-8 text-navy-500 group-hover:text-gold-500" aria-hidden />
            <h3 className="font-heading font-semibold text-navy-900">{action.title}</h3>
            <p className="text-sm text-navy-600">{action.description}</p>
          </>
        );

        const className =
          "group flex flex-col gap-2 rounded-card border-2 border-navy-200 bg-white p-4 shadow-card transition-all hover:border-gold-500 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-gold-500";

        if (action.external) {
          return (
            <a
              key={action.title}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {content}
            </a>
          );
        }

        return (
          <Link key={action.title} href={action.href} className={className}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
