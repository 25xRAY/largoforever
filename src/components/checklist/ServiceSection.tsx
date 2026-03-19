"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Progress } from "@/components/ui/Progress";

interface Activity {
  id: string;
  org?: string;
  date?: string;
  hours: number;
  description?: string;
  verified: boolean;
}

interface ServiceSectionProps {
  hours: number;
  required: number;
  percentage: number;
  activities?: Activity[];
}

/**
 * Accordion item. Hour tracker bar. Activities table. Total at bottom. If < 75: "You need X more hours".
 */
export function ServiceSection({
  hours,
  required,
  percentage,
  activities = [],
}: ServiceSectionProps) {
  const remaining = Math.max(0, required - hours);

  return (
    <Accordion.Item value="service" id="service" className="rounded-card border border-navy-200 bg-white shadow-card">
      <Accordion.Header>
        <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left font-heading text-lg font-semibold text-navy-900 hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-t-card">
          <span>Service Learning — {hours}/{required} hours</span>
          <Progress value={percentage} showLabel className="max-w-[100px]" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="px-6 pb-6 pt-0">
        <Progress value={percentage} showLabel className="mb-4" />
        {activities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-200 text-left text-navy-600">
                  <th className="py-2 pr-4">Organization</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Hours</th>
                  <th className="py-2">Verified</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => (
                  <tr key={a.id} className="border-b border-navy-100">
                    <td className="py-3">{a.org ?? "—"}</td>
                    <td className="py-3">{a.date ?? "—"}</td>
                    <td className="py-3">{a.hours}</td>
                    <td className="py-3">{a.verified ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-navy-600">No activities recorded yet.</p>
        )}
        <p className="mt-4 font-medium text-navy-900">
          Total: {hours} hours
        </p>
        {remaining > 0 && (
          <p className="mt-1 text-sm text-warning-dark">
            You need {remaining} more hours to meet the requirement.
          </p>
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
}
