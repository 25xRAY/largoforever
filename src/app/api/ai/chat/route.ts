import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { ED_RONIQ_SYSTEM_PROMPT, detectCrisisInText, checkAiRateLimit } from "@/lib/ed-roniq";
import {
  ASSESSMENTS_REQUIRED,
  CREDITS_REQUIRED,
  READINESS_WEIGHTS,
  SERVICE_HOURS_REQUIRED,
} from "@/lib/constants";
import { z } from "zod";

const bodySchema = z.object({
  message: z.string().min(1).max(8000),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(16000),
      })
    )
    .max(40)
    .optional()
    .default([]),
});

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";

async function buildStudentContext(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      gradChecklist: { include: { assessments: true } },
      serviceLearning: true,
      localObligations: true,
      ccrStatus: true,
    },
  });
  if (!user?.gradChecklist) {
    return "Student data: checklist not found; answer generally from graduation handbook.";
  }
  const gc = user.gradChecklist;
  const creditsEarned =
    gc.englishCredits +
    gc.mathCredits +
    gc.scienceCredits +
    gc.socialStudiesCredits +
    gc.fineArtsCredits +
    gc.peCredits +
    gc.healthCredits +
    gc.careerPathwayCredits;
  const creditsPct = (creditsEarned / CREDITS_REQUIRED) * 100;
  const passed = gc.assessments.filter((a) => a.result === "PASS").length;
  const assessmentsPct = (passed / ASSESSMENTS_REQUIRED) * 100;
  const svcH = user.serviceLearning?.hours ?? 0;
  const servicePct = Math.min(100, (svcH / SERVICE_HOURS_REQUIRED) * 100);
  const obl = user.localObligations;
  const oblCleared = obl
    ? [obl.feesClear, obl.deviceClear, obl.booksClear, obl.athleticClear].filter(Boolean).length
    : 0;
  const oblOk = oblCleared === 4;
  const ccr = user.ccrStatus?.met ?? false;
  const overall =
    (creditsPct / 100) * READINESS_WEIGHTS.credits +
    (assessmentsPct / 100) * READINESS_WEIGHTS.assessments +
    (servicePct / 100) * READINESS_WEIGHTS.service +
    (oblOk ? READINESS_WEIGHTS.obligations : 0) +
    (ccr ? READINESS_WEIGHTS.ccr : 0);

  return [
    `Student context (approximate readiness ${Math.round(Math.min(100, overall))}%): credits ${creditsEarned.toFixed(1)}/${CREDITS_REQUIRED}, assessments passed ${passed}/${ASSESSMENTS_REQUIRED}, service ${svcH}/${SERVICE_HOURS_REQUIRED} hrs, obligations cleared ${oblCleared}/4, CCR met: ${ccr}.`,
    `Do not infer medical or mental-health diagnoses; use crisis protocol when needed.`,
  ].join(" ");
}

/**
 * POST /api/ai/chat — Ed RonIQ. Rate limited; crisis keyword scan; Anthropic Claude.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "STUDENT" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      {
        error: "AI assistant is not configured (missing ANTHROPIC_API_KEY).",
        reply: null,
        crisisDetected: false,
      },
      { status: 503 }
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { message, conversationHistory } = parsed.data;

  const rl = checkAiRateLimit(session.user.id);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfterSec: rl.retryAfterSec },
      { status: 429 }
    );
  }

  const keywordCrisis = detectCrisisInText(message);
  let crisisDetected = keywordCrisis;

  const studentBlock = await buildStudentContext(session.user.id);
  const system = `${ED_RONIQ_SYSTEM_PROMPT}\n\n${studentBlock}`;

  const messages = [
    ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: message },
  ];

  let reply: string;

  if (keywordCrisis) {
    reply = [
      "I’m really glad you reached out. Your safety matters most.",
      "",
      "**Please use these resources right now:**",
      "- **988** — Suicide & Crisis Lifeline (call or text)",
      "- **Text HOME to 741741** — Crisis Text Line",
      `- **Counselor:** Tomeco Dates — tomeco.dates@pgcps.org, 301-808-8880`,
      "",
      "If there is immediate danger, call **911**.",
    ].join("\n");
  } else {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1024,
          system,
          messages,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        logger.error("Anthropic API error", { status: res.status, errText: errText.slice(0, 500) });
        return NextResponse.json(
          { error: "Assistant temporarily unavailable.", reply: null, crisisDetected: false },
          { status: 502 }
        );
      }
      const data = (await res.json()) as {
        content?: { type: string; text?: string }[];
      };
      const text = data.content?.find((b) => b.type === "text")?.text ?? "";
      reply = text || "I couldn’t generate a reply. Please try again.";
      if (detectCrisisInText(reply)) {
        crisisDetected = true;
      }
    } catch (e) {
      logger.error("Anthropic fetch failed", { error: String(e) });
      return NextResponse.json(
        { error: "Assistant temporarily unavailable.", reply: null, crisisDetected: false },
        { status: 502 }
      );
    }
  }

  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ai_chat",
        resource: "ed_roniq",
        details: JSON.stringify({
          crisisDetected,
          messageLen: message.length,
          model: MODEL,
        }),
      },
    });
  } catch (e) {
    logger.error("AuditLog ai_chat", { error: String(e) });
  }

  return NextResponse.json({ reply, crisisDetected });
}
