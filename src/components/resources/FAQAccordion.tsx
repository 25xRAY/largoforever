"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "How many credits do I need to graduate?",
    a: "Maryland and PGCPS require 21 credits including English, math, science, social studies, fine arts, PE, health, and career pathway coursework.",
  },
  {
    q: "How do I request transcripts?",
    a: "Contact your school counselor or registrar. Official transcripts are required for colleges and many scholarships.",
  },
  {
    q: "What assessments are required?",
    a: "Students complete state-required assessments in algebra, English, government, and life science (pathways may vary—verify with counseling).",
  },
  {
    q: "How many service-learning hours are required?",
    a: "PGCPS expects 75 hours of documented service across grades 6–12. Submit hours through your school process for verification.",
  },
  {
    q: "When should I complete the FAFSA?",
    a: "Complete the FAFSA as soon as it opens for your graduation year; many awards are first-come, first-served.",
  },
  {
    q: "What is a CCR completer?",
    a: "College and Career Readiness (CCR) means you met pathway requirements for your chosen completer program—confirm status with counseling.",
  },
];

/**
 * Radix accordion for graduation / FAFSA FAQs.
 */
export function FAQAccordion() {
  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-heading text-2xl font-bold text-navy-900">
        Frequently asked questions
      </h2>
      <Accordion.Root type="single" collapsible className="mt-6 space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <Accordion.Item
            key={i}
            value={`item-${i}`}
            className="overflow-hidden rounded-card border border-navy-200 bg-white"
          >
            <Accordion.Header>
              <Accordion.Trigger
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-left font-medium text-navy-900",
                  "hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold-500"
                )}
              >
                {item.q}
                <ChevronDown
                  className="h-5 w-5 shrink-0 transition-transform data-[state=open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="border-t border-navy-100 px-4 pb-4 pt-2 text-sm text-navy-700">
              {item.a}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
