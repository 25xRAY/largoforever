import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import { SITE_NAME, COUNSELOR_INFO } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "Terms of Service | Largo Lions Class of 2026",
  description:
    "Terms of Service for the Largo Lions Class of 2026 platform — acceptable use, student data, FERPA, and AI features.",
  path: "/terms",
});

const LAST_UPDATED = "March 2026";

const SECTIONS = [
  {
    id: "about",
    title: "1. About This Platform",
    content: `The ${SITE_NAME} platform ("Platform") is a student-facing service operated by the Talent Ready Class of 2028 development team for Largo High School, part of Prince George's County Public Schools (PGCPS). It helps Class of 2026 seniors track graduation requirements, share achievements, and create digital yearbook pages.`,
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: `Use is limited to Largo High School Class of 2026 students on the approved roster, Largo High School teaching staff with valid PGCPS credentials, and authorized school counselors and administrators. Account creation requires a valid @students.pgcps.org or @pgcps.org email address.`,
  },
  {
    id: "data",
    title: "3. Student Data & FERPA",
    content: `We comply with the Family Educational Rights and Privacy Act (FERPA) and PGCPS data governance policies. Graduation checklist data is for personal tracking only and is never shared publicly. Yearbook pages are private by default. Wall of Wins submissions are staff-reviewed before publication. No student data is sold or shared with third-party advertisers. The Platform does not store official transcripts or override school records.`,
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use",
    content: `You agree not to submit false or misleading information, upload abusive or harmful content, attempt to access other students' accounts, use the Platform for commercial purposes, or share your credentials. Violations may result in account suspension and referral to school administration.`,
  },
  {
    id: "ai",
    title: "5. AI Features (Ed RonIQ)",
    content: `Ed RonIQ is powered by Anthropic's Claude API and is designed to answer questions about graduation requirements. Responses are AI-generated and should not replace official guidance. Always verify important information with your counselor.`,
  },
  {
    id: "content",
    title: "6. Content Ownership",
    content: `You retain ownership of original content you create (yearbook entries, win descriptions, goals). By submitting content, you grant the School a non-exclusive license to display it within the Platform for educational purposes.`,
  },
  {
    id: "termination",
    title: "7. Account Termination",
    content: `Accounts are active through the end of the Class of 2026 school year. You may request deletion at any time via Settings. Staff may suspend accounts that violate these Terms.`,
  },
  {
    id: "disclaimers",
    title: "8. Disclaimers",
    content: `The Platform is for informational and organizational purposes only. It does not constitute official school records. Graduation eligibility is determined solely by PGCPS and Largo High School administration.`,
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded">
          Home
        </Link>
        <span className="mx-2 text-navy-400" aria-hidden>
          /
        </span>
        <span className="text-sm text-navy-600">Terms of Service</span>
      </div>

      <h1 className="font-heading text-3xl font-bold text-navy-900">Terms of Service</h1>
      <p className="mt-1 text-sm text-navy-600">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id}>
            <h2 className="font-heading text-lg font-semibold text-navy-900 mb-2">{s.title}</h2>
            <p className="text-sm leading-relaxed text-navy-700">{s.content}</p>
          </section>
        ))}

        <section id="contact">
          <h2 className="font-heading text-lg font-semibold text-navy-900 mb-2">9. Contact</h2>
          <p className="text-sm leading-relaxed text-navy-700">
            Questions about these Terms? Contact{" "}
            <strong>{COUNSELOR_INFO.name}</strong> at{" "}
            <a
              href={`mailto:${COUNSELOR_INFO.email}`}
              className="text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              {COUNSELOR_INFO.email}
            </a>{" "}
            or{" "}
            <a
              href={`tel:${COUNSELOR_INFO.phone}`}
              className="text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              {COUNSELOR_INFO.phone}
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-navy-200 pt-6 flex flex-wrap gap-4 text-sm">
        <Link
          href="/privacy"
          className="text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
        >
          Privacy Policy
        </Link>
        <Link href="/login" className="text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded">
          Sign In
        </Link>
        <Link href="/" className="text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded">
          Home
        </Link>
      </div>
    </div>
  );
}
