# BUILD_MANIFEST — Largo Lions Class of 2026

**Project:** largolions2026.org — Next.js 14 app for Class of 2026  
**Read this before every action.** Update "completed" and "current" as you go.

---

## Current phase

**Phase 3**  
- Phase 2 (Authentication & Onboarding) is COMPLETE.  
- Next: Public pages (wall-of-wins, yearbook, resources, leaderboards), dashboard and student flows, admin/moderator flows, API routes.

---

## Phase 2 — COMPLETE (Authentication & Onboarding)

- `src/lib/validations/auth.ts` (loginSchema, registerSchema, onboardingSchema)
- `src/app/api/auth/[...nextauth]/route.ts` (unchanged; GET/POST)
- `src/app/api/auth/register/route.ts` (POST register, bcrypt 12, 409 on duplicate)
- `src/hooks/useAuth.ts` (useSession wrapper: user, isAuthenticated, isStudent, isAdmin, isModerator, signOut)
- `src/app/(auth)/layout.tsx` (navy gradient, logo)
- `src/app/(auth)/login/page.tsx` (branded login, Google + email, RHF + loginSchema, Forgot/Register links, WebPageSchema)
- `src/app/(auth)/login/layout.tsx` (metadata: title, noIndex)
- `src/app/(auth)/register/page.tsx` (Join the Pride, Google + form, password strength, terms checkbox, redirect to onboarding)
- `src/app/(auth)/register/layout.tsx` (metadata, noIndex)
- `src/app/(auth)/onboarding/page.tsx` (3-step wizard: name/preferred/pronouns/photo, pathway/year, review + toggles; POST /api/student/onboarding)
- `src/app/api/student/onboarding/route.ts` (POST auth, onboardingSchema, transaction: User update, GradChecklist, 4 Assessments, ServiceLearning, LocalObligations, CCRStatus, AuditLog)
- Prisma `User`: profileComplete, preferredName, pronouns, graduationYear, yearbookPublic, leaderboardOptIn
- `src/components/seo/SchemaOrg.tsx`: WebPageSchema added
- `.phase_2_complete` marker

---

## Phase 1 — COMPLETE (UI Components & Public Shell)

- (see Phase 1 list in git history)

---

## Blockers

_(none)_

---

## Next up (Phase 3)

- Public pages: wall-of-wins, yearbook, resources, leaderboards
- Dashboard and student flows
- Admin and moderator flows
- API routes with Zod, auth, rate limiting
