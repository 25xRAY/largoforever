/** Site display name. */
export const SITE_NAME = "Largo Lions Class of 2026";

/** Canonical site URL. */
export const SITE_URL = "https://largolions2026.org";

/** Graduation date. */
export const GRADUATION_DATE = "June 2, 2026";

/** Total credits required for graduation. */
export const CREDITS_REQUIRED = 21;

/** Service learning hours required (grades 6–12). */
export const SERVICE_HOURS_REQUIRED = 75;

/** Number of required assessments. */
export const ASSESSMENTS_REQUIRED = 4;

/** Credits required per subject area. */
export const SUBJECT_CREDITS: Record<string, number> = {
  english: 4,
  math: 3,
  science: 3,
  socialStudies: 3,
  fineArts: 1,
  pe: 0.5,
  health: 0.5,
  careerPathway: 6,
};

/** Weights for readiness calculation (must sum to 100). */
export const READINESS_WEIGHTS = {
  credits: 40,
  assessments: 25,
  service: 15,
  obligations: 10,
  ccr: 10,
} as const;

/** Crisis resources — show on every authenticated page. */
export const CRISIS_RESOURCES = {
  nationalSuicide: {
    name: "National Suicide & Crisis Lifeline",
    number: "988",
    text: "Text or call 988",
    url: "https://988lifeline.org",
  },
  crisisTextLine: {
    name: "Crisis Text Line",
    number: "741741",
    text: "Text HOME to 741741",
    url: "https://www.crisistextline.org",
  },
} as const;

/** Counselor contact. */
export const COUNSELOR_INFO = {
  name: "Tomeco Dates",
  email: "tomeco.dates@pgcps.org",
  phone: "301-808-8880",
  calendly: "https://calendly.com/tomeco-dates",
} as const;

/** Admin / Asst. Principal. */
export const ADMIN_INFO = {
  name: "Dr. Robyn D. Jones",
  email: "robyn.jones@pgcps.org",
  title: "Assistant Principal",
} as const;

/** Main nav links (path + label) — Dashboard, Wall of Wins, Yearbook, Leaderboards, Resources. */
export const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wall-of-wins", label: "Wall of Wins" },
  { href: "/yearbook", label: "Yearbook" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/resources", label: "Resources" },
];

/** Footer links. */
export const FOOTER_LINKS: { href: string; label: string }[] = [
  { href: "/resources", label: "Resources" },
  { href: "/yearbook", label: "Yearbook" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/login", label: "Login" },
];
