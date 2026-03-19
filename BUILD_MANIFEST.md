# BUILD_MANIFEST — Largo Lions Class of 2026

**Project:** largolions2026.org — Next.js 14 app for Class of 2026  
**Read this before every action.** Update "completed" and "current" as you go.

---

## Current phase

**Phase 2**  
- Phase 1 (UI Components & Public Shell) is COMPLETE.  
- Next: Public pages (login, register, wall-of-wins, yearbook, resources, leaderboards), dashboard and student flows, admin/moderator flows, API routes.

---

## Phase 1 — COMPLETE (UI Components & Public Shell)

**UI components (src/components/ui/)**  
- Button.tsx, Input.tsx, Card.tsx, Badge.tsx, Avatar.tsx, Progress.tsx  
- Toast.tsx, Modal.tsx, Skeleton.tsx, EmptyState.tsx  
- src/components/ui/index.ts (barrel)

**Layout (src/components/layout/)**  
- Logo.tsx, Header.tsx, Footer.tsx, Sidebar.tsx, CrisisBanner.tsx, Breadcrumbs.tsx, DashboardLayout.tsx

**Homepage & API**  
- src/app/(public)/layout.tsx, src/app/(public)/page.tsx  
- src/components/home/StatsBar.tsx  
- src/app/api/public/stats/route.ts

**Error / loading**  
- src/app/not-found.tsx, src/app/error.tsx, src/app/loading.tsx

**Other**  
- NAV_LINKS updated (Dashboard, Wall of Wins, Yearbook, Leaderboards, Resources)  
- Root layout: Toaster wrapper  
- `.phase_1_complete` marker

---

## Phase 0 — COMPLETE (Project Scaffold & Infrastructure)

- (see Phase 0 list in git history)

---

## Blockers

_(none)_

---

## Next up (Phase 2)

- Public pages: login, register, wall-of-wins, yearbook, resources, leaderboards
- Dashboard and student flows
- Admin and moderator flows
- API routes with Zod, auth, rate limiting
