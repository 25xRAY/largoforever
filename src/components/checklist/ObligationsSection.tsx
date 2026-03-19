"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Check, X } from "lucide-react";

interface ObligationsSectionProps {
  feesClear: boolean;
  deviceClear: boolean;
  booksClear: boolean;
  athleticClear: boolean;
  allCleared: boolean;
}

const ITEMS = [
  { key: "feesClear" as const, label: "Fees" },
  { key: "deviceClear" as const, label: "Devices" },
  { key: "booksClear" as const, label: "Books" },
  { key: "athleticClear" as const, label: "Athletic equipment" },
];

/**
 * Accordion item. 4 checkboxes: fees, devices, books, athletic. Status indicators. If not all clear: "Visit main office".
 */
export function ObligationsSection({
  feesClear,
  deviceClear,
  booksClear,
  athleticClear,
  allCleared,
}: ObligationsSectionProps) {
  const status = { feesClear, deviceClear, booksClear, athleticClear };

  return (
    <Accordion.Item value="obligations" id="obligations" className="rounded-card border border-navy-200 bg-white shadow-card">
      <Accordion.Header>
        <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left font-heading text-lg font-semibold text-navy-900 hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded-t-card">
          <span>Local obligations — {allCleared ? "All clear" : "In progress"}</span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="px-6 pb-6 pt-0">
        <ul className="space-y-3">
          {ITEMS.map(({ key, label }) => (
            <li key={key} className="flex items-center gap-3">
              {status[key] ? (
                <Check className="h-5 w-5 text-success shrink-0" aria-hidden />
              ) : (
                <X className="h-5 w-5 text-danger shrink-0" aria-hidden />
              )}
              <span className={status[key] ? "text-navy-900" : "text-navy-600"}>{label}</span>
            </li>
          ))}
        </ul>
        {!allCleared && (
          <p className="mt-4 text-sm text-navy-600">
            Visit the main office to clear outstanding obligations.
          </p>
        )}
      </Accordion.Content>
    </Accordion.Item>
  );
}
