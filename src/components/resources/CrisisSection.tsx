import Link from "next/link";
import { CRISIS_RESOURCES, COUNSELOR_INFO } from "@/lib/constants";

/**
 * Red gradient crisis hero for Resources hub.
 */
export function CrisisSection() {
  return (
    <section
      className="rounded-card bg-gradient-to-br from-danger to-danger-dark p-8 text-white shadow-card"
      aria-labelledby="crisis-heading"
    >
      <h2 id="crisis-heading" className="font-heading text-2xl font-bold">
        You are not alone
      </h2>
      <p className="mt-2 max-w-2xl text-white/95">
        If you or someone you know is in crisis, reach out right away. Help is available 24/7.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href={`tel:${CRISIS_RESOURCES.nationalSuicide.number}`}
          className="rounded-button bg-white px-4 py-3 font-semibold text-danger-dark hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Call {CRISIS_RESOURCES.nationalSuicide.number}
        </a>
        <a
          href={`sms:${CRISIS_RESOURCES.nationalSuicide.number}`}
          className="rounded-button border-2 border-white px-4 py-3 font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Text {CRISIS_RESOURCES.nationalSuicide.number}
        </a>
        <a
          href={`sms:${CRISIS_RESOURCES.crisisTextLine.number}?&body=HOME`}
          className="rounded-button border-2 border-white px-4 py-3 font-semibold text-white hover:bg-white/10"
        >
          Text HOME to {CRISIS_RESOURCES.crisisTextLine.number}
        </a>
      </div>
      <div className="mt-8 border-t border-white/30 pt-6">
        <p className="text-sm font-semibold text-gold-200">School counselor</p>
        <p className="mt-1 text-white">
          {COUNSELOR_INFO.name} ·{" "}
          <a className="underline" href={`mailto:${COUNSELOR_INFO.email}`}>
            {COUNSELOR_INFO.email}
          </a>{" "}
          ·{" "}
          <a className="underline" href={`tel:${COUNSELOR_INFO.phone.replace(/-/g, "")}`}>
            {COUNSELOR_INFO.phone}
          </a>
        </p>
        <Link
          href={COUNSELOR_INFO.calendly}
          className="mt-3 inline-block text-sm font-medium text-gold-200 underline hover:no-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Schedule on Calendly →
        </Link>
      </div>
    </section>
  );
}
