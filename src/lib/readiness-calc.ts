import {
  CREDITS_REQUIRED,
  SERVICE_HOURS_REQUIRED,
  ASSESSMENTS_REQUIRED,
  READINESS_WEIGHTS,
} from "@/lib/constants";

export interface ReadinessChecklistInput {
  gradChecklist: {
    englishCredits: number;
    mathCredits: number;
    scienceCredits: number;
    socialStudiesCredits: number;
    fineArtsCredits: number;
    peCredits: number;
    healthCredits: number;
    careerPathwayCredits: number;
  } | null;
  assessments: { result: string }[];
  serviceLearning: { hours: number } | null;
  localObligations: {
    feesClear: boolean;
    deviceClear: boolean;
    booksClear: boolean;
    athleticClear: boolean;
  } | null;
  ccrStatus: { met: boolean; pathway: string | null } | null;
}

/** Shared graduation readiness (same formula as student dashboard). */
export function computeReadinessSummary(_userId: string, data: ReadinessChecklistInput) {
  const creditsEarned = data.gradChecklist
    ? data.gradChecklist.englishCredits +
      data.gradChecklist.mathCredits +
      data.gradChecklist.scienceCredits +
      data.gradChecklist.socialStudiesCredits +
      data.gradChecklist.fineArtsCredits +
      data.gradChecklist.peCredits +
      data.gradChecklist.healthCredits +
      data.gradChecklist.careerPathwayCredits
    : 0;
  const creditsPct = CREDITS_REQUIRED > 0 ? (creditsEarned / CREDITS_REQUIRED) * 100 : 0;

  const assessmentsPassed = data.assessments.filter((a) => a.result === "PASS").length;
  const assessmentsPct =
    ASSESSMENTS_REQUIRED > 0 ? (assessmentsPassed / ASSESSMENTS_REQUIRED) * 100 : 0;

  const serviceHours = data.serviceLearning?.hours ?? 0;
  const servicePct =
    SERVICE_HOURS_REQUIRED > 0 ? (serviceHours / SERVICE_HOURS_REQUIRED) * 100 : 0;

  const obligations = data.localObligations;
  const obligationsCleared = obligations
    ? [
        obligations.feesClear,
        obligations.deviceClear,
        obligations.booksClear,
        obligations.athleticClear,
      ].filter(Boolean).length
    : 0;
  const obligationsAllCleared = obligationsCleared === 4;

  const ccrMet = data.ccrStatus?.met ?? false;

  const overall =
    (creditsPct / 100) * READINESS_WEIGHTS.credits +
    (assessmentsPct / 100) * READINESS_WEIGHTS.assessments +
    (servicePct / 100) * READINESS_WEIGHTS.service +
    (obligationsAllCleared ? READINESS_WEIGHTS.obligations : 0) +
    (ccrMet ? READINESS_WEIGHTS.ccr : 0);

  return {
    overall: Math.round(Math.min(100, Math.max(0, overall))),
    credits: {
      earned: creditsEarned,
      required: CREDITS_REQUIRED,
      percentage: Math.round(Math.min(100, creditsPct)),
    },
    assessments: {
      passed: assessmentsPassed,
      required: ASSESSMENTS_REQUIRED,
      percentage: Math.round(Math.min(100, assessmentsPct)),
    },
    service: {
      completed: serviceHours,
      required: SERVICE_HOURS_REQUIRED,
      percentage: Math.round(Math.min(100, servicePct)),
    },
    obligations: {
      cleared: obligationsCleared,
      total: 4,
      allCleared: obligationsAllCleared,
    },
    ccr: {
      met: ccrMet,
      pathway: data.ccrStatus?.pathway ?? null,
    },
  };
}
