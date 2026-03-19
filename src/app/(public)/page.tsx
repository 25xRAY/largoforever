import Link from "next/link";
import { ClipboardCheck, Trophy, BookOpen, Sparkles, Crown, Shield, Sun, Gem } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import {
  EducationalOrganizationSchema,
  FAQPageSchema,
  WebSiteSchema,
  BreadcrumbSchema,
} from "@/components/seo/SchemaOrg";
import { Button } from "@/components/ui/Button";
import { CrisisBanner } from "@/components/layout/CrisisBanner";
import { Logo } from "@/components/layout/Logo";
import { StatsBar } from "@/components/home/StatsBar";
import { COUNSELOR_INFO, ADMIN_INFO } from "@/lib/constants";
import { getCanonicalUrl } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Largo Lions Class of 2026 | Graduation Tracker, Wall of Wins & Digital Yearbook",
  description:
    "Track graduation requirements, celebrate wins, and create your digital yearbook. Largo High School Class of 2026 — Legacy in Motion...Altitude Achieved!",
  path: "/",
  image: getCanonicalUrl("/og-home.png"),
});

const FEATURES = [
  {
    href: "/dashboard/checklist",
    icon: ClipboardCheck,
    title: "Graduation Tracker",
    description:
      "Stay on top of credits, assessments, service hours, and CCR so you cross the stage with confidence.",
  },
  {
    href: "/wall-of-wins",
    icon: Trophy,
    title: "Wall of Wins",
    description: "Share scholarships, acceptances, and milestones. Celebrate the pride.",
  },
  {
    href: "/yearbook",
    icon: BookOpen,
    title: "Digital Yearbook",
    description: "Create your permanent yearbook page. Quotes, photos, and memories that last.",
  },
  {
    href: "/dashboard/ed-roniq",
    icon: Sparkles,
    title: "Ed RonIQ",
    description: "Get answers about graduation and resources. Your AI senior sidekick.",
  },
];

const LION_PILLARS = [
  { letter: "L", word: "Leadership", icon: Crown, desc: "Leading by example and lifting others." },
  {
    letter: "I",
    word: "Integrity",
    icon: Shield,
    desc: "Doing the right thing, even when no one is watching.",
  },
  {
    letter: "O",
    word: "Optimism",
    icon: Sun,
    desc: "Believing in what's possible and staying positive.",
  },
  { letter: "N", word: "Nobility", icon: Gem, desc: "Character, honor, and pride in who we are." },
];

export default function HomePage() {
  return (
    <>
      <EducationalOrganizationSchema />
      <FAQPageSchema />
      <WebSiteSchema />
      <BreadcrumbSchema items={[{ name: "Home", url: getCanonicalUrl("/") }]} />

      {/* 1. HERO */}
      <section
        className="relative min-h-screen overflow-hidden bg-gradient-to-br from-navy-600 via-navy-700 to-navy-900"
        aria-label="Hero"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.414L51.8 0h2.827zM5.373 0l-.83.828 1.415 1.414L8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L47.556 0h1.414zM11.03 0L7.372 3.657 8.787 5.07 10.2 0H11.03zM32 0v5.657l1.414-1.414L32 0zm-4 0v5.657l-1.414-1.414L28 0z' fill='%23fff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <Logo className="h-24 w-24 animate-fadeIn text-gold-500 sm:h-32 sm:w-32" />
          <h1 className="mt-8 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl animate-fadeUp">
            Largo Lions Class of 2026
          </h1>
          <p
            className="mt-4 font-accent text-xl italic text-gold-400 sm:text-2xl md:text-3xl animate-fadeUp"
            style={{ animationDelay: "0.1s" }}
          >
            Legacy in Motion...Altitude Achieved!
          </p>
          <div
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fadeUp"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              asChild
              size="lg"
              variant="primary"
              className="bg-gold-500 text-navy-900 hover:bg-gold-400"
            >
              <Link href="/login">Track My Graduation</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="#features">Explore the Platform</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <StatsBar />

      {/* 3. FEATURE CARDS */}
      <section id="features" className="bg-white py-20" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-navy-900 text-center mb-12">
            Everything You Need to Cross That Stage
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group rounded-card border-l-4 border-navy-500 bg-white p-6 shadow-card transition-all hover:border-gold-500 hover:shadow-card-hover hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <Icon className="h-10 w-10 text-navy-500 group-hover:text-gold-500" aria-hidden />
                  <h3 className="mt-4 font-heading text-lg font-semibold text-navy-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-navy-600">{f.description}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-gold-600 group-hover:underline">
                    Learn More →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ED RONIQ DEMO */}
      <section className="bg-navy-50 py-20" aria-labelledby="edroniq-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="edroniq-heading"
            className="font-heading text-3xl font-bold text-navy-900 text-center mb-12"
          >
            Meet Ed RonIQ 🦁
          </h2>
          <div className="mx-auto max-w-2xl rounded-card border-2 border-navy-200 bg-white p-6 shadow-card">
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-lg bg-navy-100 px-4 py-2 text-sm text-navy-800">
                  How many credits do I need to graduate?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-gold-100 px-4 py-2 text-sm text-navy-800">
                  You need 21 total credits: 4 English, 3 Math, 3 Science, 3 Social Studies, 1 Fine
                  Arts, 0.5 PE, 0.5 Health, and 6 Career Pathway. You’ve got this! 🦁
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button asChild variant="primary" size="md">
                <Link href="/login">Sign In to Chat with Ed RonIQ</Link>
              </Button>
              <p className="mt-3 text-xs text-navy-500">
                For official guidance, always refer to your counselor. Ed RonIQ is a helpful tool,
                not a replacement for counseling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. L.I.O.N. PHILOSOPHY */}
      <section className="bg-navy-500 py-20" aria-labelledby="lion-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            id="lion-heading"
            className="font-heading text-5xl font-bold tracking-tight text-gold-500 text-center md:text-6xl"
          >
            L.I.O.N.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {LION_PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.letter} className="text-center text-white">
                  <Icon className="mx-auto h-12 w-12 text-gold-400" aria-hidden />
                  <p className="mt-2 font-heading text-2xl font-bold text-gold-400">{p.letter}</p>
                  <p className="font-heading text-lg font-semibold">{p.word}</p>
                  <p className="mt-1 text-sm text-white/90">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. LEADERSHIP TEAM */}
      <section className="bg-white py-20" aria-labelledby="team-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="team-heading"
            className="font-heading text-3xl font-bold text-navy-900 text-center mb-12"
          >
            Your Senior Support Team
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-card border-2 border-navy-200 bg-white p-6 shadow-card">
              <h3 className="font-heading text-xl font-semibold text-navy-900">
                {ADMIN_INFO.name}
              </h3>
              <p className="text-navy-600">{ADMIN_INFO.title}</p>
              <p className="mt-2 text-sm text-navy-500">
                CliftonStrengths: Strategic, Empathy, Individualization, Belief, Adaptability
              </p>
              <a
                href={`mailto:${ADMIN_INFO.email}`}
                className="mt-4 inline-block text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
              >
                {ADMIN_INFO.email}
              </a>
            </div>
            <div className="rounded-card border-2 border-navy-200 bg-white p-6 shadow-card">
              <h3 className="font-heading text-xl font-semibold text-navy-900">
                {COUNSELOR_INFO.name}
              </h3>
              <p className="text-navy-600">Counselor</p>
              <p className="mt-2 text-sm text-navy-500">
                <a
                  href={`tel:${COUNSELOR_INFO.phone.replace(/-/g, "")}`}
                  className="hover:underline"
                >
                  {COUNSELOR_INFO.phone}
                </a>
                {" · "}
                <a href={`mailto:${COUNSELOR_INFO.email}`} className="hover:underline">
                  {COUNSELOR_INFO.email}
                </a>
              </p>
              <a
                href={COUNSELOR_INFO.calendly}
                rel="noopener noreferrer"
                target="_blank"
                className="mt-4 inline-block rounded-button bg-gold-500 px-4 py-2 font-heading font-semibold text-navy-900 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                Book Appointment
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CRISIS BANNER (expanded) */}
      <CrisisBanner alwaysExpanded />
    </>
  );
}
