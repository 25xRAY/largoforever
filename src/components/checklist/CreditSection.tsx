"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Check, AlertTriangle, X } from "lucide-react";
import { Progress } from "@/components/ui/Progress";

interface SubjectRow {
  subject: string;
  required: number;
  earned: number;
  percent: number;
  courses?: { name: string; credits: number }[];
}

interface CreditSectionProps {
  subjects: SubjectRow[];
  totalEarned: number;
  totalRequired: number;
  percentage: number;
}

function formatSubject(key: string): string {
  const map: Record<string, string> = {
    english: "English",
    math: "Math",
    science: "Science",
    socialStudies: "Social Studies",
    fineArts: "Fine Arts",
    pe: "PE",
    health: "Health",
    careerPathway: "Career Pathway",
  };
  return map[key] ?? key;
}

function StatusIcon({ percent }: { percent: number }) {
  if (percent >= 100) return <Check className="h-5 w-5 text-success" aria-hidden />;
  if (percent >= 70) return <AlertTriangle className="h-5 w-5 text-warning" aria-hidden />;
  return <X className="h-5 w-5 text-danger" aria-hidden />;
}

/**
 * Accordion item: Academic Credits — X/21, Progress bar. Expandable table: subject, required, earned, status, courses.
 */
export function CreditSection({
  subjects,
  totalEarned,
  totalRequired,
  percentage,
}: CreditSectionProps) {
  return (
    <Accordion.Item value="credits" id="credits" className="rounded-card border border-navy-200 bg-white shadow-card">
      <Accordion.Header>
        <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left font-heading text-lg font-semibold text-navy-900 hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-t-card">
          <span>Academic Credits — {totalEarned}/{totalRequired}</span>
          <Progress value={percentage} showLabel className="max-w-[120px]" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="px-6 pb-6 pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-200 text-left text-navy-600">
                <th className="py-2 pr-4">Subject</th>
                <th className="py-2 pr-4">Required</th>
                <th className="py-2 pr-4">Earned</th>
                <th className="py-2 w-10">Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((row) => (
                <tr key={row.subject} className="border-b border-navy-100">
                  <td className="py-3 font-medium">{formatSubject(row.subject)}</td>
                  <td className="py-3">{row.required}</td>
                  <td className="py-3">{row.earned}</td>
                  <td className="py-3">
                    <StatusIcon percent={row.percent} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
