# BUILD_MANIFEST — Largo Lions Class of 2026

**Project:** largolions2026.org — Next.js 14 app for Class of 2026  
**Read this before every action.** Update "completed" and "current" as you go.

---

## Current phase

**Phase 4 — COMPLETE (release line)**  
- Wall of Wins & Digital Yearbook are the current shipped milestone.  
- **Phase 5 is not active** — any prompt or plan for leaderboards, Ed RonIQ, resources, or admin is **deferred**. Do not implement or track as “Phase 5” until explicitly restarted.

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
- **Digital Yearbook:** YearbookPage (slug, displayName, tagline, myStory, favoriteQuote, favoriteMemories, galleryPhotos, viewCount, etc.); validations, `/api/yearbook`, `/api/yearbook/me`, `/api/yearbook/[slug]`, `/api/yearbook/[slug]/comments`; YearbookCard, ClassicTemplate, PhotoGallery, CommentSection, ViewCountIncrement, YearbookPageActions, YearbookEditor; `(public)/yearbook`, `(public)/yearbook/[slug]`, `(dashboard)/yearbook/edit`; dashboard API returns `yearbookSlug`; QuickActions "View Your Page" / "Complete Yearbook". `.phase_4_complete` marker.

---

## Backlog (post–Phase 4; **not** Phase 5 until re-scoped)

_These items are **not** the current phase. Reference only when Phase 5 is explicitly opened again._

- Public pages: resources, leaderboards  
- More dashboard flows (Ed RonIQ, etc.)  
- Admin and moderator flows  
- API hardening: rate limiting, expanded Zod coverage where needed
