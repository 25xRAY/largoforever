"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Check, Circle } from "lucide-react";

interface AssessmentItem {
  id: string;
  type: string;
  result: string;
  method: string | null;
  score: string | null;
  completedAt: string | null;
}

interface AssessmentSectionProps {
  items: AssessmentItem[];
  passed: number;
  required: number;
}

const TYPE_LABELS: Record<string, string> = {
  ALGEBRA_I: "Algebra I",
  ENGLISH_10: "English 10",
  GOVERNMENT: "Government",
  LIFE_SCIENCE: "Life Science",
};

const ALTERNATIVES = "Alternatives: AP 3+, SAT 480+/530+, ACT 20+, IB 4+";

/**
 * Accordion item. 4 assessment cards: name, status, method, score, date. For incomplete: show alternatives.
 */
export function AssessmentSection({ items, passed, required }: AssessmentSectionProps) {
  return (
    <Accordion.Item
      value="assessments"
      id="assessments"
      className="rounded-card border border-navy-200 bg-white shadow-card"
    >
      <Accordion.Header>
        <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left font-heading text-lg font-semibold text-navy-900 hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-t-card">
          <span>
            Assessments — {passed}/{required} passed
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="px-6 pb-6 pt-0">
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-card border border-navy-200 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{TYPE_LABELS[item.type] ?? item.type}</span>
                {item.result === "PASS" ? (
                  <Check className="h-5 w-5 text-success" aria-hidden />
                ) : (
                  <Circle className="h-5 w-5 text-navy-400" aria-hidden />
                )}
              </div>
              {item.method && <p className="mt-1 text-sm text-navy-600">Method: {item.method}</p>}
              {item.score && <p className="text-sm text-navy-600">Score: {item.score}</p>}
              {item.completedAt && (
                <p className="text-xs text-navy-500">
                  Completed: {new Date(item.completedAt).toLocaleDateString()}
                </p>
              )}
              {item.result !== "PASS" && (
                <p className="mt-2 text-xs text-navy-500">{ALTERNATIVES}</p>
              )}
            </div>
          ))}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
