"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { WinType } from "@prisma/client";

interface WinCardProps {
  id: string;
  type: WinType;
  title: string;
  description?: string | null;
  institutionName?: string | null;
  amount?: number | null;
  scholarshipRange?: string | null;
  militaryBranch?: string | null;
  approved: boolean;
  createdAt: string;
  studentName?: string | null;
}

const TYPE_BADGE: Record<string, { variant: "default" | "gold" | "outline"; label: string }> = {
  SCHOLARSHIP: { variant: "gold", label: "Scholarship" },
  ACCEPTANCE: { variant: "default", label: "Acceptance" },
  MILITARY: { variant: "gold", label: "Military" },
  JOB: { variant: "outline", label: "Trade / Job" },
  AWARD: { variant: "gold", label: "Award" },
  OTHER: { variant: "outline", label: "Other" },
};

const BRANCH_LABELS: Record<string, string> = {
  ARMY: "Army",
  NAVY: "Navy",
  AIR_FORCE: "Air Force",
  MARINES: "Marines",
  COAST_GUARD: "Coast Guard",
  SPACE_FORCE: "Space Force",
};

/**
 * Card: institution placeholder, name, type badge (gold/navy/green/blue), student name or "A Largo Lion", amount/range/branch, Verified badge, date. Hover: gold glow.
 */
export function WinCard({
  id,
  type,
  title,
  description,
  institutionName,
  amount,
  scholarshipRange,
  militaryBranch,
  approved,
  createdAt,
  studentName,
}: WinCardProps) {
  const badge = TYPE_BADGE[type] ?? { variant: "outline" as const, label: type };
  const displayName = studentName?.trim() || "A Largo Lion";

  let amountText: string | null = null;
  if (type === "SCHOLARSHIP" && amount != null && amount > 0) {
    amountText = formatCurrency(amount);
  } else if (type === "SCHOLARSHIP" && scholarshipRange) {
    const range: Record<string, string> = {
      UNDER_1K: "Under $1K",
      ONE_TO_5K: "$1K–$5K",
      FIVE_TO_10K: "$5K–$10K",
      OVER_10K: "$10K+",
    };
    amountText = range[scholarshipRange] ?? scholarshipRange;
  } else if (type === "MILITARY" && militaryBranch) {
    amountText = BRANCH_LABELS[militaryBranch] ?? militaryBranch;
  }

  return (
    <Link
      href={`/wall-of-wins/${id}`}
      className={cn(
        "block rounded-card border-2 border-navy-200 bg-white p-5 shadow-card transition-all",
        "hover:border-gold-500 hover:shadow-gold-glow focus:outline-none focus:ring-2 focus:ring-gold-500"
      )}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-navy-100 text-navy-600 font-heading font-bold text-lg">
        {institutionName?.charAt(0) ?? "?"}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={badge.variant} size="sm">
          {badge.label}
        </Badge>
        {approved && <span className="text-xs font-medium text-success">Verified ✅</span>}
      </div>
      <h3 className="mt-2 font-heading text-lg font-semibold text-navy-900">{title}</h3>
      {institutionName && <p className="mt-1 text-sm text-navy-600">{institutionName}</p>}
      {amountText && <p className="mt-1 text-sm font-medium text-gold-600">{amountText}</p>}
      {description && <p className="mt-2 line-clamp-2 text-sm text-navy-600">{description}</p>}
      <p className="mt-3 text-xs text-navy-500">{displayName}</p>
      <p className="text-xs text-navy-400">{new Date(createdAt).toLocaleDateString()}</p>
    </Link>
  );
}
