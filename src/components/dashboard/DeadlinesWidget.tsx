"use client";

import { Calendar } from "lucide-react";
import { GRADUATION_DATE } from "@/lib/constants";

const GRADUATION_DATE_DATE = new Date("2026-06-02");
const FAFSA_DEADLINE = new Date("2026-06-30");
const YEARBOOK_DEADLINE = new Date("2026-05-15");

function daysAway(from: Date, to: Date): number {
  const diff = to.getTime() - from.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Important dates with countdowns: Graduation June 2 2026, FAFSA, yearbook. "X days away".
 */
export function DeadlinesWidget() {
  const now = new Date();
  const items = [
    { label: "Graduation", date: GRADUATION_DATE_DATE, days: daysAway(now, GRADUATION_DATE_DATE) },
    { label: "FAFSA deadline", date: FAFSA_DEADLINE, days: daysAway(now, FAFSA_DEADLINE) },
    { label: "Yearbook deadline", date: YEARBOOK_DEADLINE, days: daysAway(now, YEARBOOK_DEADLINE) },
  ];

  return (
    <div className="rounded-card border border-navy-200 bg-white p-4 shadow-card">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-navy-900">
        <Calendar className="h-4 w-4 text-gold-500" aria-hidden />
        Important dates
      </h3>
      <ul className="mt-4 space-y-3" role="list">
        {items.map((item) => (
          <li key={item.label} className="flex justify-between text-sm">
            <span className="text-navy-700">{item.label}</span>
            <span className="font-medium text-navy-900">{item.days} days away</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
