import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import { COUNSELOR_INFO } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy | Largo Lions Class of 2026",
  description:
    "Privacy Policy for the Largo Lions Class of 2026 platform — what data we collect, how we use it, and your rights.",
  path: "/privacy",
});

const LAST_UPDATED = "March 2026";

const PRIVACY_SECTIONS = [
  {
    id: "what-we-collect",
    title: "1. What We Collect",
    content:
      "We collect the information you provide when creating an account (name, email, pronouns, photo URL), content you submit (yearbook entries, Wall of Wins submissions, senior goals), and basic usage data (last login time, page views on your yearbook). We do not collect payment information, location data, or device identifiers beyond what your browser automatically sends.",
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Data",
    content:
      "Your data is used to operate the Platform: displaying your graduation checklist, powering your yearbook page, showing your wins, and enabling the Ed RonIQ AI assistant to reference your graduation status. We do not use your data for advertising or sell it to any third party.",
  },
  {
    id: "who-can-see",
    title: "3. Who Can See Your Information",
    content:
      "Your graduation checklist and profile details are visible to you, your school counselor, and authorized administrators. Your yearbook page is private by default — you control whether it is publicly viewable. Your Wall of Wins entries are reviewed by staff and, if approved, shown publicly without your full name unless you choose otherwise.",
  },
  {
    id: "third-parties",
    title: "4. Third-Party Services",
    content:
      "The Platform uses Neon (PostgreSQL database), Anthropic Claude API (Ed RonIQ AI), and Google OAuth (sign-in). Each service has its own privacy policy. We share only the minimum data necessary for each service to function. Your full student record is never transmitted to Anthropic.",
  },
  {
    id: "ferpa",
    title: "5. FERPA Compliance",
    content:
      "This Platform is operated in support of the School's educational mission and complies with FERPA. Education records stored here are treated as confidential. Parents or guardians of students under 18 may request access to their student's data by contacting the school counselor.",
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    content:
      "You may access, correct, or delete your personal data at any time through your Profile and Settings pages. To request full account deletion, go to Settings → Danger Zone. For data access requests not covered by self-service, contact your school counselor.",
  },
  {
    id: "data-retention",
    title: "7. Data Retention",
    content:
      "Account data is retained through the end of the 2025–2026 school year. Yearbook pages may be preserved as part of the school's historical archive after graduation. You may request earlier deletion via Settings.",
  },
  {
    id: "security",
    title: "8. Security",
    content:
      "We use industry-standard security practices: encrypted connections (HTTPS/TLS), hashed passwords (bcrypt), and role-based access controls. No system is perfectly secure — avoid sharing your password.",
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content:
      "We may update this Privacy Policy. Changes will be posted on this page with an updated date. Continued use of the Platform after changes constitutes acceptance.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded">
          Home
        </Link>
        <span className="mx-2 text-navy-400" aria-hidden>
          /
        </span>
        <span className="text-sm text-navy-600">Privacy Policy</span>
      </div>

      <h1 className="font-heading text-3xl font-bold text-navy-900">Privacy Policy</h1>
      <p className="mt-1 text-sm text-navy-600">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-8">
        {PRIVACY_SECTIONS.map((s) => (
          <section key={s.id} id={s.id}>
            <h2 className="font-heading text-lg font-semibold text-navy-900 mb-2">{s.title}</h2>
            <p className="text-sm leading-relaxed text-navy-700">{s.content}</p>
          </section>
        ))}

        <section id="contact">
          <h2 className="font-heading text-lg font-semibold text-navy-900 mb-2">10. Contact</h2>
          <p className="text-sm leading-relaxed text-navy-700">
            Privacy questions? Contact{" "}
            <strong>{COUNSELOR_INFO.name}</strong> at{" "}
            <a
              href={`mailto:${COUNSELOR_INFO.email}`}
              className="text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              {COUNSELOR_INFO.email}
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-navy-200 pt-6 flex flex-wrap gap-4 text-sm">
        <Link href="/terms" className="text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded">
          Terms of Service
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
