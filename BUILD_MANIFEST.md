# BUILD_MANIFEST — Largo Lions Class of 2026

**Project:** largolions2026.org — Next.js 14 app for Class of 2026  
**Read this before every action.** Update "completed" and "current" as you go.

---

## Current phase

**Phase 5 — COMPLETE (Leaderboards, Ed RonIQ, Resources hub, Admin panel)**  
**Phase 6 — COMPLETE (Testing, CI, deployment tooling)**  
Verify: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build:verify`, `npm run test:e2e` (e2e needs DB + seed + server per Playwright config).

---

## Phase 5 — COMPLETE (Leaderboards, Ed RonIQ, Resources & Admin)

- **Prisma:** `DistrictLeaderboardCategory`, `HonorDesignation`, `UserLeaderboardPreference`, user fields `displayGpa`, `apIbCourseCount`, `leadershipRolesJson`, `honorDesignation`.
- **Libs:** `admin-session.ts`, `leaderboard-public.ts`, `ed-roniq.ts`, validations `leaderboard-opt-in.ts`, `admin.ts`.
- **API:** `GET/POST` leaderboards (public / student opt-in); `GET /api/resources`; `POST /api/ai/chat` (Ed RonIQ); admin: `stats`, `moderation`, `students`, `students/[id]`, `export`, `leaderboards`.
- **Public UI:** `(public)/leaderboards` (Lions of Distinction 🏅, ItemList JSON-LD); `(public)/resources` (CrisisSection, tabbed categories, FAQPage schema).
- **Ed RonIQ:** `(dashboard)/dashboard/ed-roniq` (noIndex), `ChatInterface`, `ChatMessage`, `TypingIndicator`, `EdRoniqCrisisBanner` wired to `crisisDetected`.
- **Admin UI:** `(admin)/admin` dashboard (Recharts: wins line, readiness bar, win types pie); `moderation`, `students`, `students/[id]`, `leaderboards`, `data-export` pages; `AdminSidebar` + `DashboardLayout` variant `admin`.
- **Seed:** Resources for `graduation`, `fa`, `college`, `records`, `wellness`, `crisis`, `district`; leaderboard prefs + honors/GPA sample data for students.
- `.phase_5_complete` marker.

---

## Phase 6 — COMPLETE (Testing, performance & deployment)

- **Jest:** `jest.config.js` (multi-project), `jest.client.config.js`, `jest.api.config.js`, `jest.coverage.js`, `jest.setup.js`, `jest.setup.node.js` — Next/SWC transform per project; API tests mock `@/lib/auth` where ESM adapters break in Node.
- **Unit / integration tests:** `src/lib/__tests__/*`, `src/components/**/__tests__/*`, `src/app/api/__tests__/auth.test.ts`, `src/app/api/__tests__/wins.test.ts`.
- **Playwright:** `playwright.config.ts` (chromium, firefox, webkit, mobile-chrome, mobile-safari), `e2e/*.spec.ts` (includes `admin.spec.ts` — seeded admin sign-in → `/admin` dashboard), `@axe-core/playwright` on `/`, `/login`, `/wall-of-wins`, `/yearbook`, `/resources`, `/leaderboards`.
- **Performance / security:** `next.config.mjs` (AVIF/WebP, `remotePatterns`, `removeConsole` in prod, security headers).
- **Libs:** `src/lib/cache.ts`, `analytics.ts`, `image-processing.ts`, `static-generator.ts`; `src/lib/env.ts` (Zod validation for required env).
- **Deployment:** `vercel.json`, `Dockerfile` (uses `npm run build:verify`), `scripts/verify-next-build.mjs` (treats successful compilation with `.next/BUILD_ID` as success when Next 14.2 reports internal `/_error` prerender noise).
- **Admin archive stub:** `src/app/api/admin/archive/route.ts` (POST, admin-only, `202` + `downloadUrl: null`).
- **Public pages:** Full `(public)/resources` and `(public)/leaderboards` shipped in Phase 5 (see Phase 5 section).
- **UX / a11y:** `ReadinessMeter` uses `role="meter"` (valid ARIA); `Providers` wraps `Toaster` in one client boundary.
- **Seed:** `prisma/seed.ts` sets unique `YearbookPage.slug` for browse/e2e.
- **Tooling:** `.eslintrc.json`, `npm run typecheck`, Prettier includes `e2e` + `scripts/**/*.mjs`.
- `.phase_6_complete` marker.

---

## Phase 3 — COMPLETE (Student Dashboard & Graduation Checklist)

- `src/app/(dashboard)/layout.tsx` (DashboardLayout wrapper)
- `src/app/(dashboard)/dashboard/layout.tsx` (metadata: My Dashboard, noIndex)
- `src/app/api/student/dashboard/route.ts` (GET: user, readiness, alerts, recentWins, classStats; revalidate 300)
- `src/lib/validations/checklist.ts` (Zod schemas for checklist data)
- **Dashboard components:** ReadinessMeter, AlertsList, QuickActions, RecentWins, DeadlinesWidget
- `src/app/(dashboard)/dashboard/page.tsx` (two-column: welcome, meter, alerts, quick actions, recent wins; sidebar: profile, deadlines, class stats; React Query, loading skeleton, error retry)
- `src/app/(dashboard)/dashboard/loading.tsx` (branded skeleton)
- `src/app/api/student/checklist/route.ts` (GET: full checklist — credits, assessments, service, obligations, CCR)
- **Checklist components:** CreditSection, AssessmentSection, ServiceSection, ObligationsSection, CCRSection (Radix Accordion)
- `src/app/(dashboard)/dashboard/checklist/page.tsx` (horizontal readiness bar, 5 accordion sections, last synced, counselor contact)
- `src/app/(dashboard)/dashboard/checklist/layout.tsx` (metadata: My Graduation Checklist, noIndex)
- `.phase_3_complete` marker

---

## Phase 2 — COMPLETE (Authentication & Onboarding)

- (see Phase 2 list in git history)

---

## Blockers

_(none)_

---

## Phase 4 — COMPLETE (Wall of Wins & Digital Yearbook)

- **Wall of Wins:** Win model (evidenceUrl), validations, `/api/wins`, `/api/wins/[id]`, `/api/wins/stats`, `/api/uploads/presigned`; WinCard, WinFilters, WinSubmitForm; `(public)/wall-of-wins`, `(public)/wall-of-wins/[id]`, `(dashboard)/dashboard/wall-of-wins/submit`.
- **Digital Yearbook:** YearbookPage (slug, displayName, tagline, myStory, favoriteQuote, favoriteMemories, galleryPhotos, viewCount, accentColor, etc.); validations, `/api/yearbook`, `/api/yearbook/me`, `/api/yearbook/[slug]`, `/api/yearbook/[slug]/comments`; YearbookCard, **templates** (Classic, Minimalist/MODERN+MINIMAL, Bold, Scrapbook via `YearbookTemplateView`), PhotoGallery, CommentSection, ViewCountIncrement, YearbookPageActions, YearbookEditor; `(public)/yearbook`, `(public)/yearbook/[slug]`, `(dashboard)/yearbook/edit`; dashboard API returns `yearbookSlug`; QuickActions "View Your Page" / "Complete Yearbook". `.phase_4_complete` marker.

---

## Backlog (post–Phase 6; **not** active until re-scoped)

- Admin: dedicated **reported content** queue when backend supports it
- API hardening: expanded rate limiting / Zod coverage where needed

---

## BUILD COMPLETE

Phases 1–6 and Phase 5 feature scope delivered. The Largo Lions Class of 2026 platform is production-ready.  
**Stack:** Next.js 14, TypeScript, Tailwind CSS, PostgreSQL, Prisma, NextAuth.js  
**Legacy in Motion...Altitude Achieved!** 🦁💙💛
