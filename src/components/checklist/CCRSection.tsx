"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Progress } from "@/components/ui/Progress";
import { COUNSELOR_INFO } from "@/lib/constants";

const PATHWAY_LABELS: Record<string, string> = {
  STEM: "STEM",
  HEALTH: "Health",
  BUSINESS: "Business",
  ARTS_MEDIA: "Arts & Media",
  IT: "Information Technology",
  CONSTRUCTION: "Construction",
  EDUCATION: "Education",
  PUBLIC_SERVICE: "Public Service",
  UNDECIDED: "Not sure yet",
};

interface CCRSectionProps {
  pathway: string | null;
  met: boolean;
  completedAt?: string | null;
}

/**
 * Accordion item. Selected pathway name. Blueprint completion %. If no pathway: "Select your pathway".
 */
export function CCRSection({ pathway, met, completedAt }: CCRSectionProps) {
  const percentage = met ? 100 : pathway && pathway !== "UNDECIDED" ? 50 : pathway === "UNDECIDED" ? 25 : 0;

  return (
    <Accordion.Item
      value="ccr"
      id="ccr"
      className="rounded-card border border-navy-200 bg-white shadow-card"
    >
      <Accordion.Header>
        <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left font-heading text-lg font-semibold text-navy-900 hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-t-card">
          <span>Career Completer Pathway (CCR)</span>
          <Progress value={percentage} showLabel className="max-w-[80px]" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="px-6 pb-6 pt-0">
        {pathway === "UNDECIDED" ? (
          <p className="text-navy-700">
            You haven&apos;t selected a Career Completer Pathway yet. Talk to your counselor to explore
            your options.{" "}
            <a
              href={COUNSELOR_INFO.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              Book time with {COUNSELOR_INFO.name}
            </a>
            .
          </p>
        ) : pathway ? (
          <>
            <p className="font-medium text-navy-900">
              Pathway: {PATHWAY_LABELS[pathway] ?? pathway}
            </p>
            {completedAt && (
              <p className="mt-1 text-sm text-navy-600">
                Completed: {new Date(completedAt).toLocaleDateString()}
              </p>
            )}
            {!met && (
              <p className="mt-2 text-sm text-navy-600">
                Complete your pathway requirements to meet CCR.
              </p>
            )}
          </>
        ) : (
          <p className="text-navy-600">
            Select your pathway in onboarding or profile settings to track your Career Completer
            progress.
          </p>
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
}
