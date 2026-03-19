"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SIZE = 200;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getColor(percent: number): string {
  if (percent >= 75) return "text-success";
  if (percent >= 50) return "text-warning";
  return "text-danger";
}

interface ReadinessMeterProps {
  percentage: number;
  onCategoryClick?: (category: string) => void;
  creditsPct?: number;
  assessmentsPct?: number;
  servicePct?: number;
  obligationsCleared?: number;
  obligationsTotal?: number;
  ccrMet?: boolean;
}

/**
 * Large circular SVG progress (200px). Animated 0→actual on mount. Color: red <50, yellow 50-74, green ≥75.
 * Center: percentage + "On Track"/"Action Needed". Below: 5 mini Progress bars (clickable).
 */
export function ReadinessMeter({
  percentage,
  onCategoryClick,
  creditsPct = 0,
  assessmentsPct = 0,
  servicePct = 0,
  obligationsCleared = 0,
  obligationsTotal = 4,
  ccrMet = false,
}: ReadinessMeterProps) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(percentage), 100);
    return () => clearTimeout(t);
  }, [percentage]);

  const strokeDashoffset = CIRCUMFERENCE - (animated / 100) * CIRCUMFERENCE;
  const colorClass = getColor(percentage);

  const categories = [
    { id: "credits", label: "Credits", value: creditsPct },
    { id: "assessments", label: "Assessments", value: assessmentsPct },
    { id: "service", label: "Service", value: servicePct },
    {
      id: "obligations",
      label: "Obligations",
      value: obligationsTotal > 0 ? (obligationsCleared / obligationsTotal) * 100 : 0,
    },
    { id: "ccr", label: "CCR", value: ccrMet ? 100 : 0 },
  ];

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{ width: SIZE, height: SIZE }}
        role="img"
        aria-label={`Readiness: ${percentage}%`}
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <svg width={SIZE} height={SIZE} className="rotate-[-90deg]">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-navy-200"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn("transition-all duration-700 ease-out", colorClass)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-heading text-4xl font-bold", colorClass)}>
            {Math.round(animated)}%
          </span>
          <span className="mt-1 text-sm font-medium text-navy-600">
            {percentage >= 75 ? "On Track" : "Action Needed"}
          </span>
        </div>
      </div>
      <div className="mt-6 w-full max-w-xs space-y-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryClick?.(cat.id)}
            className="flex w-full items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
          >
            <span className="w-20 shrink-0 text-xs font-medium text-navy-700">{cat.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-100">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  cat.value >= 75 ? "bg-success" : cat.value >= 50 ? "bg-warning" : "bg-danger"
                )}
                style={{ width: `${Math.min(100, cat.value)}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
