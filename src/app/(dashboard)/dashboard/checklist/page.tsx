"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { CreditSection } from "@/components/checklist/CreditSection";
import { AssessmentSection } from "@/components/checklist/AssessmentSection";
import { ServiceSection } from "@/components/checklist/ServiceSection";
import { ObligationsSection } from "@/components/checklist/ObligationsSection";
import { CCRSection } from "@/components/checklist/CCRSection";
import { Progress } from "@/components/ui/Progress";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { COUNSELOR_INFO } from "@/lib/constants";

async function fetchChecklist() {
  const res = await fetch("/api/student/checklist");
  if (!res.ok) throw new Error("Failed to load checklist");
  return res.json();
}

function countComplete(data: {
  credits: { percentage: number };
  assessments: { passed: number; required: number };
  service: { percentage: number };
  obligations: { allCleared: boolean };
  ccr: { met: boolean };
}): number {
  let n = 0;
  if (data.credits.percentage >= 100) n++;
  if (data.assessments.passed >= data.assessments.required) n++;
  if (data.service.percentage >= 100) n++;
  if (data.obligations.allCleared) n++;
  if (data.ccr.met) n++;
  return n;
}

export default function ChecklistPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["checklist"],
    queryFn: fetchChecklist,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rect" className="h-12 w-full" />
        <Skeleton variant="rect" className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-card border-2 border-danger bg-danger-light/30 p-8 text-center">
        <p className="font-medium text-navy-900">Could not load your checklist.</p>
        <Button variant="primary" size="md" className="mt-4" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const completeCount = countComplete(data);
  const totalRequirements = 5;
  const overallPct = (completeCount / totalRequirements) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">My Graduation Checklist</h1>
        <p className="mt-1 text-navy-600">
          {completeCount} of {totalRequirements} requirement categories complete
        </p>
        <Progress value={overallPct} showLabel className="mt-4 max-w-md" />
      </div>

      <Accordion.Root type="multiple" className="space-y-4">
        <CreditSection
          subjects={data.credits.subjects}
          totalEarned={data.credits.totalEarned}
          totalRequired={data.credits.totalRequired}
          percentage={data.credits.percentage}
        />
        <AssessmentSection
          items={data.assessments.items}
          passed={data.assessments.passed}
          required={data.assessments.required}
        />
        <ServiceSection
          hours={data.service.hours}
          required={data.service.required}
          percentage={data.service.percentage}
          activities={data.service.activities}
        />
        <ObligationsSection
          feesClear={data.obligations.feesClear}
          deviceClear={data.obligations.deviceClear}
          booksClear={data.obligations.booksClear}
          athleticClear={data.obligations.athleticClear}
          allCleared={data.obligations.allCleared}
        />
        <CCRSection
          pathway={data.ccr.pathway}
          met={data.ccr.met}
          completedAt={data.ccr.completedAt}
        />
      </Accordion.Root>

      <div className="rounded-card border border-navy-200 bg-navy-50 p-4 text-sm text-navy-600">
        <p>
          Data last synced: {data.lastSynced ? new Date(data.lastSynced).toLocaleString() : "—"}
        </p>
        <p className="mt-2">
          Questions? Contact your counselor{" "}
          <a
            href={`mailto:${COUNSELOR_INFO.email}`}
            className="font-medium text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
          >
            {COUNSELOR_INFO.name}
          </a>
          {" "}
          at {COUNSELOR_INFO.phone} or{" "}
          <Link
            href={COUNSELOR_INFO.calendly}
            rel="noopener noreferrer"
            target="_blank"
            className="font-medium text-gold-600 hover:underline"
          >
            book an appointment
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
