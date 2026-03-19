"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { winSubmissionSchema, type WinSubmissionInput } from "@/lib/validations/wins";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const WIN_TYPES = [
  { value: "SCHOLARSHIP", label: "Scholarship" },
  { value: "ACCEPTANCE", label: "College acceptance" },
  { value: "MILITARY", label: "Military" },
  { value: "JOB", label: "Job / Trade" },
  { value: "AWARD", label: "Award" },
  { value: "OTHER", label: "Other" },
] as const;

const SCHOLARSHIP_RANGES = [
  { value: "UNDER_1K", label: "Under $1K" },
  { value: "ONE_TO_5K", label: "$1K–$5K" },
  { value: "FIVE_TO_10K", label: "$5K–$10K" },
  { value: "OVER_10K", label: "$10K+" },
];

const MILITARY_BRANCHES = [
  { value: "ARMY", label: "Army" },
  { value: "NAVY", label: "Navy" },
  { value: "AIR_FORCE", label: "Air Force" },
  { value: "MARINES", label: "Marines" },
  { value: "COAST_GUARD", label: "Coast Guard" },
  { value: "SPACE_FORCE", label: "Space Force" },
];

export function WinSubmitForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<WinSubmissionInput>({
    resolver: zodResolver(winSubmissionSchema),
    defaultValues: {
      type: "SCHOLARSHIP",
      title: "",
      description: "",
      institutionName: "",
      institutionType: null,
      scholarshipRange: null,
      scholarshipType: null,
      militaryBranch: null,
      amount: null,
      evidenceUrl: "",
    },
  });

  const watchType = form.watch("type");

  const onSubmit = async (data: WinSubmissionInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/wins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          evidenceUrl: data.evidenceUrl || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        form.setError("root", { message: err.error ?? "Submit failed." });
        return;
      }
      toast({
        title: "Win submitted!",
        description: "It will appear after review.",
        variant: "success",
      });
      router.push("/wall-of-wins");
      router.refresh();
    } catch {
      form.setError("root", { message: "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Step {step} of 3 — {step === 1 ? "Type" : step === 2 ? "Details" : "Review"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <>
              <p className="text-sm text-navy-600">What kind of win is this?</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {WIN_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => form.setValue("type", t.value)}
                    className={`rounded-card border-2 p-4 text-left font-medium transition-colors ${
                      watchType === t.value
                        ? "border-gold-500 bg-gold-50"
                        : "border-navy-200 hover:border-navy-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <Button type="button" onClick={() => setStep(2)}>
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Input
                label="Title"
                placeholder="e.g. Merit Scholarship to State U"
                errorMessage={form.formState.errors.title?.message}
                {...form.register("title")}
              />
              <Input
                label="Institution or organization name"
                placeholder="e.g. University of Maryland"
                errorMessage={form.formState.errors.institutionName?.message}
                {...form.register("institutionName")}
              />
              <Input
                label="Short description (10–250 chars)"
                placeholder="Tell us a bit about this win"
                errorMessage={form.formState.errors.description?.message}
                {...form.register("description")}
              />
              {watchType === "SCHOLARSHIP" && (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Amount ($)</label>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      className="w-full rounded-button border-2 border-navy-200 px-4 py-3"
                      {...form.register("amount", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Range (if amount unknown)
                    </label>
                    <select
                      className="w-full rounded-button border-2 border-navy-200 px-4 py-3"
                      {...form.register("scholarshipRange")}
                    >
                      <option value="">—</option>
                      {SCHOLARSHIP_RANGES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {watchType === "MILITARY" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Branch</label>
                  <select
                    className="w-full rounded-button border-2 border-navy-200 px-4 py-3"
                    {...form.register("militaryBranch")}
                  >
                    <option value="">—</option>
                    {MILITARY_BRANCHES.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <Input
                label="Evidence link (optional)"
                placeholder="https://..."
                errorMessage={form.formState.errors.evidenceUrl?.message}
                {...form.register("evidenceUrl")}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="rounded-lg bg-navy-50 p-4 text-sm">
                <p>
                  <strong>Type:</strong> {WIN_TYPES.find((t) => t.value === watchType)?.label}
                </p>
                <p>
                  <strong>Title:</strong> {form.getValues("title")}
                </p>
                <p>
                  <strong>Institution:</strong> {form.getValues("institutionName") || "—"}
                </p>
                <p>
                  <strong>Description:</strong> {form.getValues("description") || "—"}
                </p>
              </div>
              {form.formState.errors.root && (
                <p className="text-danger">{form.formState.errors.root.message}</p>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit" isLoading={submitting} loadingText="Submitting...">
                  Submit for review
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
