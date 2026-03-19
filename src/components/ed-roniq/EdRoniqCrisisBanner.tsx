"use client";

import { CRISIS_RESOURCES, COUNSELOR_INFO } from "@/lib/constants";

interface EdRoniqCrisisBannerProps {
  active: boolean;
}

/**
 * Non-dismissible crisis resources strip above Ed RonIQ when `active`.
 */
export function EdRoniqCrisisBanner({ active }: EdRoniqCrisisBannerProps) {
  if (!active) return null;
  return (
    <div
      className="rounded-card border-2 border-danger bg-danger-light/40 p-4 text-danger-dark"
      role="alert"
      aria-live="assertive"
    >
      <p className="font-heading font-bold">Crisis resources — please use now</p>
      <ul className="mt-2 list-inside list-disc text-sm">
        <li>
          <strong>{CRISIS_RESOURCES.nationalSuicide.text}</strong> — call or text{" "}
          <a
            className="font-semibold underline"
            href={`tel:${CRISIS_RESOURCES.nationalSuicide.number}`}
          >
            {CRISIS_RESOURCES.nationalSuicide.number}
          </a>
        </li>
        <li>
          <strong>Crisis Text Line:</strong> Text HOME to {CRISIS_RESOURCES.crisisTextLine.number}
        </li>
        <li>
          <strong>Counselor:</strong> {COUNSELOR_INFO.name} — {COUNSELOR_INFO.email},{" "}
          {COUNSELOR_INFO.phone}
        </li>
      </ul>
    </div>
  );
}
