# BUILD_MANIFEST — Largo Lions Class of 2026

**Project:** largolions2026.org — Next.js 14 app for Class of 2026  
**Read this before every action.** Update "completed" and "current" as you go.

---

## Current phase

**Phase 4**  
- Phase 3 (Student Dashboard & Graduation Checklist) is COMPLETE.  
- Next: Public pages (wall-of-wins, yearbook, resources, leaderboards), more dashboard flows, admin/moderator, API routes.

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

## Next up (Phase 4)

- Public pages: wall-of-wins, yearbook, resources, leaderboards
- More dashboard flows (wins, yearbook edit, Ed RonIQ)
- Admin and moderator flows
- API routes with Zod, auth, rate limiting
