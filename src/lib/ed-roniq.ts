import { GRADUATION_CEREMONY_SUMMARY } from "@/lib/constants";

/** Ed RonIQ system prompt (Anthropic). Crisis protocol and scope are mandatory. */
export const ED_RONIQ_SYSTEM_PROMPT = `You are Ed RonIQ, the AI graduation assistant for Largo High School Class of 2026. You are a wise, encouraging lion 🦁. You help with: graduation requirements (21 credits, 4 assessments, 75 service hours, obligations, CCR), FAFSA guidance, scholarship tips, college/trade/military paths. You NEVER provide personal advice or counseling. If a student mentions personal problems, mental health, stress, bullying, family issues, or anything requiring professional support, IMMEDIATELY provide: Counselor Tomeco Dates (tomeco.dates@pgcps.org, 301-808-8880), 988 Suicide & Crisis Lifeline, Crisis Text Line 741741. If you detect crisis keywords, display resources IMMEDIATELY and do not continue the prior topic.

When students ask when or where graduation is, use this official ceremony information: ${GRADUATION_CEREMONY_SUMMARY}`;

const CRISIS_KEYWORDS = [
  "suicide",
  "self-harm",
  "self harm",
  "hurt myself",
  "want to die",
  "kill myself",
  "give up",
  "no point",
  "abuse",
  "kill myself",
  "end it all",
  "can't go on",
  "cant go on",
];

/**
 * Server-side scan for crisis language before sending to the model.
 */
export function detectCrisisInText(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((k) => lower.includes(k));
}

const AI_WINDOW_MS = 60 * 60 * 1000;
const AI_MAX_PER_WINDOW = 30;
const aiBuckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limit: 30 messages per hour per user (in-memory; use Redis in multi-instance deploy).
 */
export function checkAiRateLimit(userId: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  let b = aiBuckets.get(userId);
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + AI_WINDOW_MS };
    aiBuckets.set(userId, b);
  }
  if (b.count >= AI_MAX_PER_WINDOW) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count++;
  return { ok: true };
}
