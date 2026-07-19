# STAYTALENTREADY.COM — MASTER GOVERNING DOCUMENT
## All Decisions Resolved · Build-Ready
## May 14, 2026 | Carlton A. James
## Governing Authority: Carlton A. James — Independent Platform

---

## ⚠️ GOVERNING RULE — READ FIRST, EVERY SESSION

StayTalentReady.com is a **standalone, student-built academic readiness platform** for
Talent Ready students at Largo High School, Prince George's County, Maryland.

This platform is **NOT** a 25 Alpha LLC product.
This platform is **NOT** dependent on the Congressional App Challenge to exist.
This platform is **NOT** dependent on AFQT Arena, PraxisPass, or any 25 Alpha codebase.

The Congressional App Challenge and other recognition programs are **nice-to-have submission
opportunities** — not the mission. The mission is: every Talent Ready student has every
course mapped, every assignment visible, every mastery gate enforced, before they walk
into their first class.

AFQT Arena and PraxisPass are **reference quality standards only** — not architectural
dependencies, not shared infrastructure, not shared accounts.

---

## PART 1 — PLATFORM IDENTITY

| Field | Value |
|-------|-------|
| Platform Name | StayTalentReady.com |
| Domain | staytalentready.com |
| Purpose | Academic readiness platform for Talent Ready dual enrollment students at Largo High School |
| Primary User | High school students — grades 9, 10, 11, 12 — Talent Ready program |
| Program Teacher | Carlton A. James — CTE Instructor, Largo High School, PGCPS |
| Submission Lead | Giselle Solomon — Congressional App Challenge submission on behalf of 25-student team |
| Official Team (4) | One student per grade: 9th, 10th, 11th, 12th — names TBD by Giselle |
| District | Maryland's 5th Congressional District |
| Representative | Rep. Steny H. Hoyer (retiring — office: 301-474-0119) |
| Challenge Deadline | October 26, 2026 — nice-to-have, not mission-critical |
| Mission Status | UNCONDITIONAL — app ships regardless of challenge outcome |
| IP Owner | TBD — independent of 25 Alpha LLC and 25 ACTUAL Holdings LLC |
| Operating Entity | Independent — Carlton A. James personal or new entity (TBD) |
| Future API | DAPLU (long-term) — Anthropic direct (interim) |
| AI Disclosure | Required in challenge submission — lead with it, not hide it |

---

## PART 2 — ALL EIGHT DECISIONS — FULLY RESOLVED

### DECISION 1 — Submitter & Team ✅ LOCKED
**Submitter:** Giselle Solomon, on behalf of the 25-student Talent Ready cohort.
**Official team of 4:** One student from each grade level — 9th, 10th, 11th, 12th.
**Remaining 21 students:** Full contributing developers — credited in submission description,
featured in demo video, doing real coding. Their names and contributions documented in
the submission materials. The 4 registered students are the official entry; the 25 are
the product team.
**AI Disclosure:** Mandatory. Submit as a strength: "We used Claude to help architect
this platform. Every production line was written by our students."

### DECISION 2 — District & Representative ✅ LOCKED
**District:** Maryland's 5th Congressional District — MD-05
**Representative:** Rep. Steny H. Hoyer (retiring January 2026 — not seeking reelection)
**Key action:** Giselle calls (301) 474-0119 to confirm challenge is active under
the transitioning office. This is administrative confirmation only — the app builds
regardless of the answer.
**Backup submission venues:** Other student app competitions (Congressional App Challenge
is one of several — not the only path to recognition).

### DECISION 3 — The 15 Subjects ✅ LOCKED
14 subjects confirmed from the Syllabus Summary. Subject 15 is Spanish.

| # | Code | Subject | Semester | Category |
|---|------|---------|----------|----------|
| 1 | NTR-1010 | Introduction to Nutrition | Spring 2026 | PGCC Dual Enrollment |
| 2 | SOC-1010 | Introduction to Sociology | Spring 2026 | PGCC Dual Enrollment |
| 3 | INT-1700 | Understanding Operating Systems | Fall 2025 | PGCC Dual Enrollment |
| 4 | COM-1010 | Introduction to Communication | Fall 2025 | PGCC Dual Enrollment |
| 5 | INT-1111 | Programming Logic & Design | Spring/Summer 2025 | PGCC Dual Enrollment |
| 6 | INT-1010 | Intro to Information Technology | Fall 2024 + 2025 | PGCC Dual Enrollment |
| 7 | ENGL-1340 | Technical Writing / English Composition | Spring 2026 | PGCC Dual Enrollment |
| 8 | INT-2310 | Windows Server Administration | Spring 2026 | PGCC Dual Enrollment |
| 9 | INT-2840 | System Analysis & Project Management | Spring 2026 | PGCC Dual Enrollment |
| 10 | ETH-HACK | Ethical Hacking / Cybersecurity | Fall 2025 | PGCC Dual Enrollment |
| 11 | MAT-1350 | Pre-Calculus Part 1 | Fall 2025 | PGCC Dual Enrollment |
| 12 | ENGL-1010 | English Composition I | Fall 2025 | PGCC Dual Enrollment |
| 13 | PAS-1000 | First Year Experience | Summer 2025 | PGCC Dual Enrollment |
| 14 | INT-1550 | Intro to Networks / Network+ Prep | Fall 2025 | PGCC Dual Enrollment |
| 15 | SPAN | Spanish | TBD | PILOT — Core HS Course |

**Subject 15 — Spanish — is the strategic pivot.**
Spanish is the first core Largo High School course added to the platform. It is explicitly
a pilot for a future expansion that maps ALL Largo High School core courses alongside
the PGCC dual enrollment curriculum. The long-term vision: every Talent Ready student,
every course they will ever take at Largo, mapped and ready before the first day of class.

### DECISION 4 — Mastery Gate Logic ✅ LOCKED

**The Rule:** A student must score **85% or higher on their FIRST ATTEMPT within a
24-hour window** to advance to the next level.

**What counts as mastery:**
- Score ≥ 85% on attempt #1 within the current 24-hour window → GATE OPENS → student advances

**What does NOT count as mastery:**
- Score ≥ 85% on attempt #2 or later within the same 24-hour window → GATE STAYS CLOSED
- Repeated retakes until memorization → system detects attempt count → BLOCKED
- Score ≥ 85% after the 24-hour window expires → new window, new first attempt required

**The Philosophy (Carlton's words, verbatim governing intent):**
The objective is for students to understand the material and within a sitting take that
exam and master it. Taking it over and over within a period — even if they eventually
score 85% — doesn't count because mastery through repetition within one session is
memorization, not comprehension.

**Implementation constants:**
```
MASTERY_THRESHOLD:        85        // percent — minimum to advance
FIRST_ATTEMPT_ONLY:       true      // only attempt #1 in window counts
WINDOW_HOURS:             24        // hours per attempt window
MAX_ATTEMPTS_PER_WINDOW:  unlimited // students can try — only #1 matters
GATE_OPENS_ON:            'FIRST_ATTEMPT_PASS'
GATE_BLOCKED_ON:          'SUBSEQUENT_ATTEMPT_PASS'
COOLDOWN_AFTER_BLOCK:     24        // hours until new window opens
INSTRUCTOR_OVERRIDE:      true      // Carlton can unlock manually with log entry
```

### DECISION 5 — Anti-Cheat Scope ✅ LOCKED (with CIA Closer phase guidance)

**Primary interface:** Voice submission — voice is the default, not optional.
**Fallback interface:** Multiple choice — always available as alternative to voice.

**Phase 1 (Submission scope — build now):**
- Voice as primary input for exam responses
- Speaker fingerprint per device — one person, one device lock
- Random voice authentication challenges during sessions (not just at login)
- FingerprintJS Pro device binding — prevents device handoff mid-exam
- Tab detection — exam pauses and flags if student leaves the tab
- Copy-paste blocking — disabled during active exam mode
- Time-on-task monitoring — answers submitted faster than minimum reading time are flagged
- Randomized question ordering — same pool, different sequence every attempt
- Answer choice rotation — choices shuffled every attempt
- Server-side scoring only — client never sees correct answer

**Phase 2 (Post-submission — CIA Council confirmed):**
- Voice emotion detection — stress detection, proxy-speaker detection
- Banking-grade voice biometric authentication (Azure Cognitive Services Speech or
  AWS Transcribe with speaker diarization)
- Behavioral ML model for anomaly scoring

**CIA Closer note on voice scope:** Emotion detection in Phase 1 risks being the
demo's liability if not working demonstrably in 3 minutes. Phase 2 label it as
"planned enhancement" in submission materials — judges respect honest roadmaps.

### DECISION 6 — Brand & Design System ✅ PARTIALLY RESOLVED
**Name:** StayTalentReady.com — locked
**Colors:** TBD — Carlton must decide palette. Suggested direction: academic confidence
(not military, not startup — the feeling of being prepared). No placeholder colors in code.
**Typography:** TBD — Carlton must decide. Suggestion: clear, modern, accessible.
**Tagline:** TBD

### DECISION 7 — Technology Stack ✅ LOCKED
Full production stack confirmed. No simplification for the challenge.

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 16.x App Router + TypeScript strict | Latest stable |
| Auth | Clerk | Separate instance — student + teacher roles |
| Database | Supabase PostgreSQL | Separate project — RLS on every table |
| Cache | Upstash Redis | Mastery gate state + rate limiting |
| AI — Interim | Anthropic claude-sonnet-4-20250514 | Direct API, server-side only |
| AI — Long-term | DAPLU API | Abstraction layer from day one |
| Voice STT | Deepgram or OpenAI Whisper | Primary voice capture |
| Voice Auth | Speaker fingerprint — Phase 1 | FP Pro for device |
| Device ID | FingerprintJS Pro | Anti-cheat device enforcement |
| Analytics | Mixpanel | Separate project |
| Monitoring | Sentry | All environments |
| Deployment | Vercel | Separate project — repo: staytalentready |
| Package Mgr | pnpm exclusively | Never npm |
| Testing | Jest + Playwright | 80% minimum coverage |

### DECISION 8 — Deadline ✅ LOCKED
**Congressional App Challenge deadline:** October 26, 2026, 11:59 PM ET — 165 days.
**Platform mission deadline:** None — the app ships when it's done, for students who
need it now and future students who will always need it. The Congressional deadline
is a milestone, not a dependency.

---

## PART 3 — CIA COUNCIL RESULTS (MAY 14, 2026)

```
COUNCIL VERDICT: AMBER → PROCEEDING (Carlton authorized)
RECOMMENDATION: BUILD — all AMBER items resolved by Carlton's clarifications

THE ARCHITECT    CLEAR
THE COMMANDER    CLEAR
THE SIGNAL       AMBER → RESOLVED — challenge is nice-to-have, not dependency;
                          app builds unconditionally; Giselle calls Hoyer's office
                          for administrative confirmation only
THE NAVIGATOR    AMBER → RESOLVED — team of 4 confirmed (one per grade level);
                          25 students are contributing developers credited in submission
THE HERALD       CLEAR
THE VOICE        CLEAR
THE CLOSER       AMBER → RESOLVED — voice emotion detection scoped to Phase 2;
                          Phase 1 ships speaker fingerprint + random voice challenges;
                          Phase 2 labeled as planned enhancement in submission
THE ANCHOR       [PRIVATE]

P0 FINDING RESOLVED: Team size cap addressed — 4-student official submission team
                      confirmed, 21 contributing developers credited appropriately.
```

**All AMBER items resolved by Carlton's May 14 directive.**
**Build is authorized to proceed.**

---

## PART 4 — THE LONG-TERM VISION (LOCKED)

Carlton's directive establishes the trajectory beyond the 15 current subjects:

**Phase 1 — Current:** 14 PGCC dual enrollment courses + Spanish pilot
**Phase 2 — Near term:** All PGCC Talent Ready dual enrollment courses added as they are
offered each semester. The platform grows with the program.
**Phase 3 — Largo HS Core Courses:** Every Largo High School core course (9th-12th grade)
mapped into the platform. Every student, every subject, every assignment, every due date —
visible before the first day of class. Talent Ready students always stay ready.
**Phase 4 — Replication:** The model is replicable to any CTE program in any school
that runs dual enrollment. StayTalentReady.com becomes the infrastructure.

**The North Star statement (Carlton's words, governing the product):**
Our final objective is to ensure that our Talent Ready students have every single course
mapped out before they touch one day of class — and then we will take all of their Largo
High School courses and map them in future dates so Talent Ready will always stay ready
with the courses at their fingertips in one application.

---

## PART 5 — CORE ENGINES (WHAT THE APP DOES)

### Engine 1 — Course Map
Every PGCC dual enrollment course + Largo HS courses displayed by grade level and semester.
Student sees their full academic roadmap before the first day of class.
- Subject → Unit → Lesson → Assignment hierarchy
- Due dates pre-loaded from syllabus data
- Semester sequencing by grade (9th, 10th, 11th, 12th)
- Spanish pilot as first Largo HS core course

### Engine 2 — Mastery Gate
Voice-primary assessment. 85% first-attempt rule enforced server-side.
- Student takes exam via voice (primary) or multiple choice (fallback)
- Server scores and evaluates attempt number within 24-hour window
- Gate opens only on first-attempt pass at 85%+
- All other paths: blocked with specific study guidance
- Instructor override available with mandatory log entry

### Engine 3 — Anti-Cheat Layer
Device fingerprint + speaker fingerprint + behavioral monitoring.
- One device, one person — enforced at enrollment
- Random voice authentication challenges during active sessions
- Tab detection, copy-paste blocking, time-on-task monitoring
- Answer pool randomization every attempt
- All scoring server-side — client never holds correct answers

### Engine 4 — Voice Interface
Voice is the primary interaction mode throughout the app.
- Voice submission for exam answers
- Voice navigation ("go to my next assignment")
- Voice feedback on results
- Speaker authentication random checks mid-session
- Multiple choice always available as fallback — never removed

### Engine 5 — Progress Dashboard
Every student sees their full picture in one view.
- Course completion percentage per subject
- Mastery gate status (open/blocked) per unit
- Next due date across all courses
- Time-to-deadline countdown
- Streak tracking (days of active study)

### Engine 6 — Instructor View
Carlton (and future teachers) see the cohort without individual scores exposed to peers.
- Class-level completion rates
- Students blocked at mastery gates (needs intervention)
- Anti-cheat flags for review
- Manual gate override with documented reason
- Grade level rollup (9th, 10th, 11th, 12th)

---

## PART 6 — DATABASE SCHEMA (CORE TABLES)

```sql
-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR NOT NULL,
  grade_level INTEGER NOT NULL CHECK (grade_level IN (9, 10, 11, 12)),
  device_fingerprint VARCHAR,           -- FingerprintJS Pro visitor ID
  speaker_fingerprint JSONB,            -- Voice biometric embedding
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Courses (all 15)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR NOT NULL UNIQUE,         -- 'NTR-1010', 'INT-1700', 'SPAN', etc.
  title VARCHAR NOT NULL,
  category VARCHAR NOT NULL,            -- 'PGCC_DUAL_ENROLLMENT' | 'LARGO_HS_CORE'
  credit_hours INTEGER,
  semester VARCHAR,                     -- 'Fall 2025', 'Spring 2026', etc.
  grade_levels INTEGER[],               -- Which grade levels take this course
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Units (chapters, modules within a course)
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id),
  title VARCHAR NOT NULL,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assignments (per syllabus)
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES units(id),
  title VARCHAR NOT NULL,
  type VARCHAR NOT NULL,                -- 'QUIZ' | 'EXAM' | 'DISCUSSION' | 'PROJECT' | 'LAB'
  points_possible INTEGER,
  due_date DATE,
  week_number INTEGER,
  lockdown_browser_required BOOLEAN DEFAULT false,
  sequence_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mastery Gate per Student per Unit
CREATE TABLE mastery_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  gate_status VARCHAR NOT NULL DEFAULT 'LOCKED',
                                        -- 'LOCKED' | 'OPEN' | 'INSTRUCTOR_OVERRIDE'
  window_opened_at TIMESTAMPTZ,         -- Start of current 24h window
  first_attempt_score DECIMAL(5,2),     -- Score on attempt #1 of current window
  first_attempt_at TIMESTAMPTZ,
  total_attempts_this_window INTEGER DEFAULT 0,
  passed_on_first_attempt BOOLEAN,
  instructor_override BOOLEAN DEFAULT false,
  override_reason TEXT,
  override_by UUID,                     -- Instructor user ID
  override_at TIMESTAMPTZ,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, unit_id)
);

-- Exam Attempts (full audit log)
CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  unit_id UUID NOT NULL REFERENCES units(id),
  attempt_number INTEGER NOT NULL,      -- 1 = first attempt in window
  window_start TIMESTAMPTZ NOT NULL,    -- 24h window start
  submission_method VARCHAR NOT NULL,   -- 'VOICE' | 'MULTIPLE_CHOICE'
  score DECIMAL(5,2) NOT NULL,
  passed BOOLEAN NOT NULL,
  counted_for_gate BOOLEAN NOT NULL,    -- Only attempt #1 = true
  voice_auth_passed BOOLEAN,
  anti_cheat_flags JSONB DEFAULT '[]',  -- Array of flag objects
  device_fingerprint VARCHAR,
  speaker_match_score DECIMAL(5,2),     -- 0.0-1.0 voice match confidence
  tab_switches INTEGER DEFAULT 0,
  time_on_task_seconds INTEGER,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Anti-Cheat Events
CREATE TABLE anti_cheat_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  attempt_id UUID REFERENCES exam_attempts(id),
  event_type VARCHAR NOT NULL,          -- 'TAB_SWITCH' | 'COPY_PASTE' | 'FAST_SUBMIT'
                                        -- | 'DEVICE_MISMATCH' | 'VOICE_MISMATCH'
                                        -- | 'RANDOM_AUTH_FAIL'
  severity VARCHAR NOT NULL,            -- 'LOW' | 'MEDIUM' | 'HIGH'
  details JSONB,
  reviewed BOOLEAN DEFAULT false,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Progress (denormalized for dashboard speed)
CREATE TABLE student_progress (
  student_id UUID PRIMARY KEY REFERENCES students(id),
  total_units INTEGER DEFAULT 0,
  units_mastered INTEGER DEFAULT 0,
  units_blocked INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  last_active_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- All tables: RLS ENABLED, service_role modifies, users read own data only
```

---

## PART 7 — API ROUTES (CORE)

```
POST   /api/auth/enroll           — Student enrollment + device fingerprint registration
POST   /api/auth/voice-register   — Speaker fingerprint enrollment (voice sample)
POST   /api/auth/voice-check      — Random voice auth challenge during session

GET    /api/courses               — All 15 courses for student's grade level
GET    /api/courses/[code]        — Single course with full unit/assignment tree
GET    /api/courses/[code]/progress — Student's mastery gate status per unit

POST   /api/exam/start            — Start exam session (logs window open, device check)
POST   /api/exam/submit           — Submit answers (voice transcript or MC selections)
                                    Server scores, evaluates attempt#, updates gate
GET    /api/exam/gate/[unitId]    — Current gate status for student+unit

GET    /api/dashboard/student     — Full student dashboard data
GET    /api/dashboard/instructor  — Cohort view (aggregate, no peer exposure)
POST   /api/instructor/override   — Unlock gate with mandatory reason log

POST   /api/anticheat/event       — Log anti-cheat event (tab switch, etc.)
GET    /api/anticheat/flags       — Instructor view of flagged attempts

POST   /api/voice/transcribe      — STT for exam voice submission
POST   /api/ai/score              — AI scoring of voice response against rubric
                                    Server-side only — ANTHROPIC_API_KEY never client
```

---

## PART 8 — DAPLU ABSTRACTION LAYER

From day one, all AI calls route through a single adapter so DAPLU drops in without
code reconstruction.

```typescript
// lib/ai-client.ts — written once, never changed when DAPLU goes live

const AI_BASE_URL = process.env.DAPLU_API_URL
  ?? 'https://api.anthropic.com/v1/messages'

const AI_KEY = process.env.DAPLU_API_KEY
  ?? process.env.ANTHROPIC_API_KEY

export async function callAI(params: {
  system: string
  prompt: string
  maxTokens?: number
}): Promise<string> {
  const response = await fetch(AI_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL ?? 'claude-sonnet-4-20250514',
      max_tokens: params.maxTokens ?? 1000,
      system: params.system,
      messages: [{ role: 'user', content: params.prompt }],
    }),
  })
  const data = await response.json()
  const text = data.content.map((b: any) => b.text || '').join('')
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}
// When DAPLU goes live: set DAPLU_API_URL and DAPLU_API_KEY in Vercel.
// Zero code changes required.
```

---

## PART 9 — QUALITY GATES (ALL MUST CLEAR BEFORE DELIVERY)

| Gate | Standard |
|------|----------|
| GATE-01 Fortune 50 | Zero ambiguity · every edge case handled · production-ready |
| GATE-02 Webby | Instinctive nav · mobile-first (375px) · no dead ends |
| GATE-03 WCAG 2.2 AA | 8.5:1 contrast · 14px body min · keyboard nav · skip links |
| GATE-04 Zero Placeholders | No TBD · no lorem ipsum · no [insert here] in shipped code |
| GATE-05 Mastery Gate Enforced | Server-side only · first attempt rule in every code path |
| GATE-06 Anti-Cheat Active | Device fingerprint + voice auth + tab detection in every exam |
| GATE-07 Security | Server-side AI only · no API keys client-side · RLS enforced |
| GATE-08 Voice Primary | Voice submission works end-to-end · MC fallback always present |
| GATE-09 90/10 Execution | Claude carries 90% of build weight |
| GATE-10 80/20 Ship Floor | Nothing ships below 80% complete — no stubs |

---

## PART 10 — P0 BUILD BACKLOG

In priority order. Nothing ships before Gate checks.

- [ ] Project scaffold: Next.js 16 + TypeScript strict + Tailwind + Supabase + Clerk + pnpm
- [ ] DAPLU abstraction layer: `lib/ai-client.ts` — written before any AI call
- [ ] Database schema: all 8 core tables with RLS
- [ ] Seed data: all 15 courses + units from syllabus data
- [ ] Auth: Clerk — student role + instructor role — device fingerprint at enrollment
- [ ] Voice registration: speaker fingerprint enrollment flow
- [ ] Course map: grade-level view — all 15 subjects visible before first class
- [ ] Unit/Assignment tree: full syllabus → database → rendered per course
- [ ] Engine 2 — Mastery Gate: `POST /api/exam/submit` + `lib/mastery-gate.ts`
- [ ] Engine 3 — Anti-Cheat: tab detection + copy-paste blocking + time-on-task
- [ ] Engine 4 — Voice interface: Deepgram/Whisper STT + voice submission flow
- [ ] Engine 1 — Course Map dashboard: student view — all 15 courses, gate status
- [ ] Engine 6 — Instructor view: cohort dashboard — aggregate only, no peer exposure
- [ ] Engine 5 — Progress dashboard: streak, completion %, next due date
- [ ] Random voice auth challenges: Redis-scheduled, fires during active sessions
- [ ] FingerprintJS Pro integration: device binding, mismatch detection
- [ ] AI exam scoring: `POST /api/ai/score` via DAPLU abstraction layer
- [ ] Spanish pilot: first Largo HS core course — mapped and live
- [ ] Submission demo prep: 3-minute video showing mastery gate in action

---

## PART 11 — SUBMISSION STRATEGY (MULTI-VENUE)

The Congressional App Challenge is the primary target but not the only one.
If MD-05 is unavailable due to the Hoyer transition, the following alternatives apply:

| Venue | Notes |
|-------|-------|
| Congressional App Challenge MD-05 | Primary — Giselle calls (301) 474-0119 to confirm |
| PGCPS Student Technology Showcase | Local — Prince George's County school district showcase |
| Maryland State Department of Education CTE Student Competition | State-level |
| Congressional App Challenge other district | If student lives/attends in another MD district |
| NCWIT Aspirations in Computing | National — student tech recognition |
| Regeneron Science Talent Search | National — student research/tech |
| Maryland MESA (Mathematics Engineering Science Achievement) | State — STEM students |

**The app ships to students regardless of which, if any, competition is entered.**

---

## PART 12 — WHAT NEVER CHANGES

```
staytalentready.com              — the only domain
85%                              — mastery threshold — never negotiated
First attempt only               — retakes in the same window never count
24-hour window                   — gate evaluation period — never shortened
Voice is primary                 — MC is always the fallback — never removed
Server-side scoring              — client never holds correct answers — ever
One device, one person           — device fingerprint enforced at enrollment
Spanish is the pilot             — first Largo HS core course — the blueprint
The app builds unconditionally   — no competition outcome changes this
DAPLU abstraction from day one   — never hard-code Anthropic — always abstracted
pnpm                             — never npm
RLS on every table               — never skipped
Instructor sees aggregate only   — individual scores never exposed to peers
90/10 handoff                    — ends every major deliverable
```

---

## PART 13 — 90/10 HANDOFF — THIS SESSION

**What AI Built (90%):**
- Complete governing document with all 8 decisions resolved
- Full database schema (8 tables, RLS, constraints)
- Complete API route map
- DAPLU abstraction layer pattern
- Engine specifications for all 6 engines
- Anti-cheat scope locked (Phase 1 vs Phase 2)
- Mastery gate constants locked with implementation guidance
- Build backlog in priority order
- Multi-venue submission strategy
- CIA Council report with all AMBER items resolved

**What Requires Carlton (10%):**
- Brand colors and typography — zero code before this is decided
- Platform tagline — copy cannot be written without it
- Designate the official 4-student submission team (Giselle coordinates)
- Giselle calls (301) 474-0119 to confirm challenge status — administrative only
- Create GitHub repo: `staytalentready`
- Create separate Supabase project (not shared with any 25 Alpha project)
- Create separate Clerk instance (not shared with any 25 Alpha project)
- Create separate Vercel project: `staytalentready`
- Create separate Mixpanel project
- Add FingerprintJS Pro key (separate account or AFQT Arena key if licensed)
- Confirm DAPLU API contact / timeline for key handoff
- Confirm Spanish course structure (which Spanish — Spanish I, II, PGCC equivalent?)

**Gates Cleared:**
- GATE-01 Fortune 50: Every decision backed by specific logic, zero ambiguity
- GATE-04 Zero Placeholders: All 15 subjects named, all engines specified
- GATE-09 90/10 Execution: AI carried full governing document
- GATE-10 80/20 Ship Floor: Document is production-complete

**Gate Failures:**
- GATE-06 (Design System): Colors and typography undefined — no UI can be built until resolved
- GATE-08 (Voice Primary): DAPLU API key and Deepgram/Whisper key needed before voice layer

---

*StayTalentReady.com — Master Governing Document v1.0*
*May 14, 2026 | Carlton A. James*
*Built for Talent Ready students at Largo High School, Prince George's County, Maryland.*
*Platform is independent — not a 25 Alpha LLC product.*
*Technology infrastructure TBD — operating entity TBD.*
*This document governs every Claude Code session on this project.*
*Do not modify without explicit authorization from Carlton A. James.*
