import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  COUNSELOR_INFO,
  ADMIN_INFO,
  CRISIS_RESOURCES,
  CREDITS_REQUIRED,
  SERVICE_HOURS_REQUIRED,
  ASSESSMENTS_REQUIRED,
  GRADUATION_DATE,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Help & Support | Largo Lions Class of 2026",
  description:
    "Get help with graduation requirements, contact your counselor, access crisis support, and find answers to common questions.",
  robots: { index: false, follow: false },
};

const FAQS = [
  {
    q: "How many credits do I need to graduate?",
    a: `You need ${CREDITS_REQUIRED} total credits: English 4, Math 3, Science 3, Social Studies 3, Fine Arts 1, PE 0.5, Health 0.5, and Career Pathway 6.`,
  },
  {
    q: "How many service-learning hours are required?",
    a: `${SERVICE_HOURS_REQUIRED} hours documented across grades 6–12 are required for PGCPS graduation.`,
  },
  {
    q: "What assessments are required?",
    a: `${ASSESSMENTS_REQUIRED} assessments: Algebra I, English 10, Government, and Life Science. You can meet each with a state test, AP exam (score 3+), SAT (480+/530+), ACT (20+), or IB (4+).`,
  },
  {
    q: "When is graduation?",
    a: `Largo Lions Class of 2026 graduation is ${GRADUATION_DATE}.`,
  },
  {
    q: "What is a Career Completer Pathway?",
    a: "A sequence of courses in an area such as STEM, Health Science, Business, Arts & Media, IT, Construction, Education, or Public Service — worth 6 of your required credits.",
  },
  {
    q: "I see 'Obligations not cleared' — what does that mean?",
    a: "You may have an outstanding fee, unreturned device, library book, or athletic equipment. Contact your teacher or front office to clear it before graduation.",
  },
  {
    q: "How do I update my graduation checklist?",
    a: "Your checklist is synced by your counselor and school records. If something looks wrong, contact your counselor to correct it.",
  },
  {
    q: "How do I change my career pathway?",
    a: "Go to Dashboard → My Profile, or contact your counselor to discuss changing your pathway. Changes must be approved before the end of the school year.",
  },
  {
    q: "Who can see my yearbook page?",
    a: "Only you by default. Once you publish it and set it to public under Privacy on your profile or Settings, anyone with the link can view it.",
  },
  {
    q: "How do I submit a win to the Wall of Wins?",
    a: "Go to Dashboard → Submit a Win. Your win will be reviewed by a staff member before it appears publicly.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

function ContactCard({
  name,
  title,
  email,
  phone,
  calendly,
}: {
  name: string;
  title: string;
  email: string;
  phone?: string;
  calendly?: string;
}) {
  return (
    <div className="rounded-card border border-navy-200 bg-white p-5 shadow-card">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-100 text-navy-700 font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy-900">{name}</p>
          <p className="text-sm text-navy-600">{title}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <a
              href={`mailto:${email}`}
              className="font-medium text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              {email}
            </a>
            {phone && (
              <>
                <span className="text-navy-300">·</span>
                <a
                  href={`tel:${phone}`}
                  className="font-medium text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                >
                  {phone}
                </a>
              </>
            )}
          </div>
          {calendly && (
            <a
              href={calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-button bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
            >
              Book an Appointment
              <span aria-hidden>→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function CrisisCard({
  name,
  action,
  href,
  tel,
}: {
  name: string;
  action: string;
  href: string;
  tel?: string;
}) {
  return (
    <div className="rounded-card border border-danger-light bg-danger-light/30 p-5">
      <p className="font-semibold text-danger-dark">{name}</p>
      <p className="mt-1 text-sm text-danger-dark">{action}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {tel && (
          <a
            href={`tel:${tel}`}
            className="inline-flex items-center gap-1 rounded bg-danger px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
          >
            Call / Text {tel}
          </a>
        )}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded border border-danger bg-white px-3 py-1.5 text-sm font-medium text-danger-dark hover:bg-danger-light/20 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
        >
          Learn more →
        </a>
      </div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="space-y-10 pb-16">
      <JsonLd data={faqSchema} />

      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">Help &amp; Support</h1>
        <p className="mt-1 text-sm text-navy-600">
          Answers, contacts, and crisis resources — all in one place.
        </p>
      </div>

      <section aria-labelledby="crisis-heading">
        <h2 id="crisis-heading" className="font-heading text-lg font-semibold text-danger-dark mb-4">
          Crisis Support — Available 24/7
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <CrisisCard
            name={CRISIS_RESOURCES.nationalSuicide.name}
            action="Call or text for immediate mental health support."
            href={CRISIS_RESOURCES.nationalSuicide.url}
            tel="988"
          />
          <CrisisCard
            name={CRISIS_RESOURCES.crisisTextLine.name}
            action="Text HOME to 741741 for confidential crisis support."
            href={CRISIS_RESOURCES.crisisTextLine.url}
          />
        </div>
      </section>

      <section aria-labelledby="contacts-heading">
        <h2 id="contacts-heading" className="font-heading text-lg font-semibold text-navy-900 mb-4">
          Your School Team
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactCard
            name={COUNSELOR_INFO.name}
            title="School Counselor"
            email={COUNSELOR_INFO.email}
            phone={COUNSELOR_INFO.phone}
            calendly={COUNSELOR_INFO.calendly}
          />
          <ContactCard name={ADMIN_INFO.name} title={ADMIN_INFO.title} email={ADMIN_INFO.email} />
        </div>
      </section>

      <section aria-labelledby="quicklinks-heading">
        <h2 id="quicklinks-heading" className="font-heading text-lg font-semibold text-navy-900 mb-4">
          Quick Links
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/dashboard/checklist", label: "My Graduation Checklist" },
            { href: "/dashboard/profile", label: "My Profile" },
            { href: "/dashboard/settings", label: "Account Settings" },
            { href: "/dashboard/ed-roniq", label: "Ask Ed RonIQ" },
            { href: "/wall-of-wins", label: "Wall of Wins" },
            { href: "/yearbook", label: "Digital Yearbook" },
            { href: "/resources", label: "Resources Hub" },
            { href: "/leaderboards", label: "Lions of Distinction" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-card border border-navy-200 bg-white px-4 py-3 text-sm font-medium text-navy-800 shadow-card hover:border-gold-400 hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-gold-500 shrink-0" aria-hidden />
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="font-heading text-lg font-semibold text-navy-900 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-card border border-navy-200 bg-white shadow-card"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-navy-900 marker:content-none hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-inset">
                {q}
                <span aria-hidden className="shrink-0 text-navy-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <div className="border-t border-navy-100 px-5 py-4 text-sm text-navy-700 leading-relaxed">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-card border border-gold-300 bg-gold-50 p-6">
        <h2 className="font-heading text-base font-semibold text-navy-900">Still need help?</h2>
        <p className="mt-1 text-sm text-navy-700">
          Your counselor {COUNSELOR_INFO.name} is available to answer any questions about graduation
          requirements, pathways, or personal support.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`mailto:${COUNSELOR_INFO.email}`}
            className="inline-flex items-center gap-1.5 rounded-button bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
          >
            Email {COUNSELOR_INFO.name}
          </a>
          <a
            href={COUNSELOR_INFO.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-button border border-navy-300 bg-white px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
          >
            Book an Appointment →
          </a>
        </div>
      </section>
    </div>
  );
}
