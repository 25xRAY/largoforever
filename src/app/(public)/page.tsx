import Link from "next/link";
import Image from "next/image";
import {
  ClipboardCheck,
  Trophy,
  BookOpen,
  Sparkles,
  Crown,
  Shield,
  Sun,
  Gem,
  ArrowRight,
  GraduationCap,
  Users,
  Star,
  Zap,
} from "lucide-react";
import { generatePageMetadata, getCanonicalUrl } from "@/lib/seo";
import {
  EducationalOrganizationSchema,
  FAQPageSchema,
  WebSiteSchema,
  BreadcrumbSchema,
} from "@/components/seo/SchemaOrg";
import { CrisisBanner } from "@/components/layout/CrisisBanner";
import { StatsBar } from "@/components/home/StatsBar";
import { COUNSELOR_INFO, ADMIN_INFO, GRADUATION_DATE } from "@/lib/constants";

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
    description: "Credits, assessments, service hours, and CCR — all in one place.",
    badge: "Essential",
  },
  {
    href: "/wall-of-wins",
    icon: Trophy,
    title: "Wall of Wins",
    description: "Scholarships, acceptances, milestones. Celebrate the pride.",
    badge: "Public",
  },
  {
    href: "/yearbook",
    icon: BookOpen,
    title: "Digital Yearbook",
    description: "Your permanent page. Quotes, photos, memories that last forever.",
    badge: "Yours",
  },
  {
    href: "/dashboard/ed-roniq",
    icon: Sparkles,
    title: "Ed RonIQ AI",
    description: "Ask anything about graduation. Your AI senior sidekick.",
    badge: "AI-Powered",
  },
];

const LION_PILLARS = [
  { letter: "L", word: "Leadership", icon: Crown, desc: "Leading by example and lifting others." },
  { letter: "I", word: "Integrity", icon: Shield, desc: "Doing the right thing, always." },
  { letter: "O", word: "Optimism", icon: Sun, desc: "Believing in what's possible." },
  { letter: "N", word: "Nobility", icon: Gem, desc: "Character, honor, and pride." },
];

function daysLeft(): number {
  const grad = new Date("2026-06-02");
  const now = new Date();
  return Math.max(0, Math.ceil((grad.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function HomePage() {
  const days = daysLeft();

  return (
    <>
      <EducationalOrganizationSchema />
      <FAQPageSchema />
      <WebSiteSchema />
      <BreadcrumbSchema items={[{ name: "Home", url: getCanonicalUrl("/") }]} />

      <section
        className="relative min-h-screen overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001a3d 0%, #002a5c 40%, #003B7A 70%, #001a3d 100%)",
        }}
        aria-label="Hero"
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #FFD700 0px,
              #FFD700 1px,
              transparent 1px,
              transparent 40px
            )`,
          }}
          aria-hidden
        />

        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, transparent, #C0C0C0, #FFD700, #C0C0C0, transparent)" }}
          aria-hidden
        />

        <div className="absolute top-6 right-6 z-10 hidden sm:block">
          <div
            className="rounded-full px-4 py-2 text-center"
            style={{ background: "rgba(204,0,0,0.9)", border: "1px solid #CC0000" }}
          >
            <p className="text-xs font-semibold text-white/80 uppercase tracking-widest">Graduation</p>
            <p className="text-2xl font-bold text-white leading-none">{days}</p>
            <p className="text-xs text-white/70">days away</p>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="relative mb-8 animate-fadeIn">
            <div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(192,0,0,0.4) 0%, transparent 70%)" }}
              aria-hidden
            />
            <div
              className="relative rounded-full p-2"
              style={{
                background: "linear-gradient(135deg, #C0C0C0, #888, #C0C0C0, #666, #C0C0C0)",
                boxShadow: "0 0 60px rgba(192,0,0,0.5), 0 0 30px rgba(255,215,0,0.3)",
              }}
            >
              <div
                className="rounded-full p-2"
                style={{ background: "linear-gradient(135deg, #001a3d, #002a5c)" }}
              >
                <div
                  className="flex h-64 w-64 sm:h-72 sm:w-72 items-center justify-center rounded-full"
                  style={{ background: "rgba(0,10,30,0.5)" }}
                >
                  <Image
                    src="/images/largo-crest-red.png"
                    alt="Largo High School Class of 2026 crest — Largo Lions"
                    width={280}
                    height={280}
                    className="h-36 w-36 rounded-full object-contain sm:h-44 sm:w-44"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          <p
            className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] animate-fadeIn"
            style={{ color: "#C0C0C0", animationDelay: "0.05s" }}
          >
            Largo High School · Est. 1957
          </p>

          <h1
            className="font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl animate-fadeUp"
            style={{ animationDelay: "0.1s", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            Class of <span style={{ color: "#FFD700" }}>2026</span>
          </h1>

          <div
            className="my-4 h-1 w-32 rounded-full animate-fadeUp"
            style={{
              background: "linear-gradient(90deg, transparent, #CC0000, #FFD700, #CC0000, transparent)",
              animationDelay: "0.15s",
            }}
            aria-hidden
          />

          <p
            className="font-accent text-xl italic sm:text-2xl md:text-3xl animate-fadeUp"
            style={{ color: "#FFD700", animationDelay: "0.2s" }}
          >
            Legacy in Motion...Altitude Achieved!
          </p>

          <div
            className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 animate-fadeUp"
            style={{
              background: "rgba(204,0,0,0.2)",
              border: "1px solid rgba(204,0,0,0.5)",
              animationDelay: "0.25s",
            }}
          >
            <GraduationCap className="h-4 w-4" style={{ color: "#FFD700" }} aria-hidden />
            <span className="text-sm font-medium text-white">
              Graduation · {GRADUATION_DATE}
            </span>
          </div>

          <div
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fadeUp"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-navy-900"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFC200)",
                color: "#001a3d",
                boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
              }}
            >
              Track My Graduation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              href="/wall-of-wins"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-navy-900"
              style={{
                background: "rgba(204,0,0,0.8)",
                border: "1px solid rgba(204,0,0,0.9)",
                boxShadow: "0 4px 24px rgba(204,0,0,0.3)",
              }}
            >
              <Trophy className="h-4 w-4" aria-hidden />
              See Class Wins
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-medium text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Explore Platform
            </Link>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden>
            <div className="h-8 w-5 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
              <div className="h-2 w-0.5 rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      </section>

      <StatsBar />

      <section
        className="py-16"
        style={{ background: "linear-gradient(135deg, #8B0000, #CC0000, #8B0000)" }}
        aria-labelledby="milestones-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="milestones-heading" className="sr-only">
            Class milestones
          </h2>
          <div className="grid grid-cols-2 gap-px lg:grid-cols-4" style={{ background: "rgba(255,255,255,0.1)" }}>
            {[
              { label: "Days Until Graduation", value: days.toString(), sub: "June 2, 2026" },
              { label: "Credits to Graduate", value: "21", sub: "Required" },
              { label: "Service Hours", value: "75", sub: "Grades 6–12" },
              { label: "Largo Lions", value: "350+", sub: "Class of 2026" },
            ].map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center justify-center py-10 px-6 text-center"
                style={{ background: "rgba(139,0,0,0.6)" }}
              >
                <p className="font-heading text-4xl font-bold sm:text-5xl" style={{ color: "#FFD700" }}>
                  {m.value}
                </p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-white">{m.label}</p>
                <p className="text-xs text-white/60">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-24" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#CC0000" }}>
              Everything You Need
            </p>
            <h2
              id="features-heading"
              className="font-heading mt-2 text-3xl font-bold sm:text-4xl"
              style={{ color: "#003B7A" }}
            >
              Built for Lions. Built for 2026.
            </h2>
            <p className="mt-4 text-lg text-navy-600 max-w-2xl mx-auto">
              One platform for every step of your senior year — from first day to crossing that stage.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
                  style={{ background: "linear-gradient(135deg, #001a3d, #003B7A)" }}
                >
                  <span
                    className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: "rgba(255,215,0,0.15)",
                      color: "#FFD700",
                      border: "1px solid rgba(255,215,0,0.3)",
                    }}
                  >
                    {f.badge}
                  </span>

                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, #C0C0C0, transparent)" }}
                    aria-hidden
                  />

                  <Icon
                    className="h-10 w-10 transition-transform group-hover:scale-110"
                    style={{ color: "#FFD700" }}
                    aria-hidden
                  />
                  <h3 className="mt-4 font-heading text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{f.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: "#FFD700" }}>
                    Get Started
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="py-24"
        style={{ background: "linear-gradient(135deg, #f8f8f8, #fff, #f8f8f8)" }}
        aria-labelledby="wins-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#CC0000" }}>
                No Login Required
              </p>
              <h2
                id="wins-heading"
                className="font-heading mt-2 text-3xl font-bold sm:text-4xl"
                style={{ color: "#003B7A" }}
              >
                🏆 Wall of Wins
              </h2>
              <p className="mt-2 text-navy-600">
                Celebrating every scholarship, acceptance, and milestone from the Class of 2026.
              </p>
            </div>
            <Link
              href="/wall-of-wins"
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold-500"
              style={{ background: "#003B7A" }}
            >
              See All Wins
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { type: "SCHOLARSHIP", title: "$40,000 Scholarship", school: "Howard University", emoji: "🎓" },
              { type: "ACCEPTANCE", title: "Full Ride — Engineering", school: "Morgan State University", emoji: "🏛️" },
              { type: "MILITARY", title: "US Navy Commitment", school: "Naval Academy Prep", emoji: "⚓" },
            ].map((w) => (
              <div
                key={w.title}
                className="rounded-xl border p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
                style={{ borderColor: "#e5e7eb", borderLeftWidth: 4, borderLeftColor: "#003B7A" }}
              >
                <span className="text-2xl">{w.emoji}</span>
                <span
                  className="ml-2 rounded-full px-2 py-0.5 text-xs font-bold uppercase"
                  style={{ background: "#003B7A", color: "#FFD700" }}
                >
                  {w.type}
                </span>
                <h3 className="mt-3 font-heading font-bold text-navy-900">{w.title}</h3>
                <p className="text-sm text-navy-600 mt-1">{w.school}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-24"
        style={{ background: "linear-gradient(135deg, #001a3d 0%, #003B7A 50%, #001a3d 100%)" }}
        aria-labelledby="edroniq-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
                style={{ background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.3)" }}
              >
                <Sparkles className="h-4 w-4" style={{ color: "#FFD700" }} aria-hidden />
                <span className="text-sm font-semibold" style={{ color: "#FFD700" }}>
                  AI-Powered · Always Available
                </span>
              </div>

              <h2 id="edroniq-heading" className="font-heading text-3xl font-bold text-white sm:text-4xl">
                Meet Ed RonIQ 🦁
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Your graduation AI. Ask about credits, service hours, assessments, career pathways, or anything else
                standing between you and that stage.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  '"How many credits do I still need?"',
                  '"What counts for my service hours?"',
                  '"What\'s the deadline for FAFSA?"',
                  '"Can you explain the CCR pathway?"',
                ].map((q) => (
                  <li key={q} className="flex items-start gap-3">
                    <div
                      className="mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,215,0,0.2)" }}
                      aria-hidden
                    >
                      <Zap className="h-3 w-3" style={{ color: "#FFD700" }} />
                    </div>
                    <span className="text-sm text-white/80 italic">{q}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  style={{ background: "#FFD700", color: "#001a3d" }}
                >
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Ask Ed RonIQ
                </Link>
                <p className="self-center text-xs text-white/50">Sign in required · Free for all students</p>
              </div>
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}
            >
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)" }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-base"
                  style={{ background: "#FFD700" }}
                  aria-hidden
                >
                  🦁
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Ed RonIQ</p>
                  <p className="text-xs text-white/50">Your Graduation Assistant · Online</p>
                </div>
                <div className="ml-auto h-2 w-2 rounded-full bg-success" aria-label="Online" />
              </div>

              <div className="space-y-4 p-5">
                {[
                  { from: "user", text: "How many credits do I need to graduate?" },
                  {
                    from: "ed",
                    text: "You need 21 total credits, Lion! That's 4 English, 3 Math, 3 Science, 3 Social Studies, 1 Fine Arts, 0.5 PE, 0.5 Health, and 6 Career Pathway credits. Check your checklist to see where you stand! 🦁",
                  },
                  { from: "user", text: "What's my Career Pathway?" },
                  {
                    from: "ed",
                    text: "Your pathway shows in your checklist after you sign in. Counselors can help you choose or change STEM, Health, Business, and other CCR options. Want a walkthrough? Open Ed RonIQ when you're logged in!",
                  },
                ].map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className="max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed"
                      style={
                        msg.from === "user"
                          ? { background: "#FFD700", color: "#001a3d", fontWeight: 500 }
                          : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div
                  className="flex-1 rounded-full px-4 py-2 text-xs text-white/40"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  Ask Ed RonIQ anything...
                </div>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: "#FFD700" }}
                  aria-hidden
                >
                  <ArrowRight className="h-4 w-4 text-navy-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24" aria-labelledby="lion-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#CC0000" }}>
              The Largo Way
            </p>
            <h2
              id="lion-heading"
              className="font-heading mt-2 text-3xl font-bold sm:text-4xl"
              style={{ color: "#003B7A" }}
            >
              What It Means to Be a Lion
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LION_PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.letter}
                  className="group rounded-2xl p-8 text-center transition-all hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, #f8f8f8, #fff)",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: "linear-gradient(135deg, #001a3d, #003B7A)" }}
                  >
                    <span className="font-heading text-2xl font-black" style={{ color: "#FFD700" }}>
                      {p.letter}
                    </span>
                  </div>
                  <Icon className="mx-auto mb-2 h-6 w-6" style={{ color: "#CC0000" }} aria-hidden />
                  <h3 className="font-heading text-lg font-bold" style={{ color: "#003B7A" }}>
                    {p.word}
                  </h3>
                  <p className="mt-2 text-sm text-navy-600">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #f0f4f8, #e8eef5)" }}
        aria-labelledby="team-heading"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="team-heading"
            className="font-heading text-2xl font-bold sm:text-3xl mb-12"
            style={{ color: "#003B7A" }}
          >
            Your Support Team
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                name: COUNSELOR_INFO.name,
                title: "School Counselor",
                email: COUNSELOR_INFO.email,
                phone: COUNSELOR_INFO.phone,
                calendly: COUNSELOR_INFO.calendly,
                initial: "TD",
              },
              {
                name: ADMIN_INFO.name,
                title: ADMIN_INFO.title,
                email: ADMIN_INFO.email,
                phone: null,
                calendly: null,
                initial: "RJ",
              },
            ].map((person) => (
              <div
                key={person.name}
                className="rounded-2xl p-8 text-left bg-white"
                style={{ border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #CC0000, #8B0000)" }}
                  >
                    {person.initial}
                  </div>
                  <div>
                    <p className="font-heading font-bold" style={{ color: "#003B7A" }}>
                      {person.name}
                    </p>
                    <p className="text-sm text-navy-600">{person.title}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <a
                    href={`mailto:${person.email}`}
                    className="block text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                  >
                    {person.email}
                  </a>
                  {person.phone && (
                    <a
                      href={`tel:${person.phone.replace(/-/g, "")}`}
                      className="block text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                    >
                      {person.phone}
                    </a>
                  )}
                  {person.calendly && (
                    <a
                      href={person.calendly}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                      style={{ background: "#003B7A" }}
                    >
                      Book an Appointment →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-24 text-center"
        style={{ background: "linear-gradient(135deg, #001a3d, #003B7A, #001a3d)" }}
        aria-labelledby="cta-heading"
      >
        <div className="mx-auto max-w-3xl px-4">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "rgba(255,215,0,0.15)", border: "2px solid rgba(255,215,0,0.4)" }}
          >
            <GraduationCap className="h-10 w-10" style={{ color: "#FFD700" }} aria-hidden />
          </div>
          <h2 id="cta-heading" className="font-heading text-3xl font-bold text-white sm:text-4xl">
            {days} Days Until You Cross That Stage
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Every credit, every hour, every win — it all leads to {GRADUATION_DATE}. Let&apos;s make sure
            you&apos;re ready.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold-500"
              style={{ background: "#FFD700", color: "#001a3d", boxShadow: "0 4px 24px rgba(255,215,0,0.3)" }}
            >
              <Star className="h-4 w-4" aria-hidden />
              Start Tracking Now
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-medium text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <Users className="h-4 w-4" aria-hidden />
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <CrisisBanner alwaysExpanded />
    </>
  );
}
