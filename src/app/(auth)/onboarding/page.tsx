"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/auth";
import { Button, Input, Progress } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { CompleterPathway } from "@prisma/client";

const COMPLETER_PATHWAY_LABELS: Record<CompleterPathway, string> = {
  STEM: "STEM",
  HEALTH: "Health",
  BUSINESS: "Business",
  ARTS_MEDIA: "Arts & Media",
  IT: "Information Technology",
  CONSTRUCTION: "Construction",
  EDUCATION: "Education",
  PUBLIC_SERVICE: "Public Service",
};

const STEPS = 3;

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<OnboardingInput & { preferredName?: string; pronouns?: string }>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      preferredName: "",
      pronouns: "",
      completerPathway: "STEM",
      graduationYear: 2026,
      yearbookPublic: true,
      leaderboardOptIn: false,
    },
  });

  const { register, handleSubmit, watch, setValue } = form;
  const preferredName = watch("preferredName");
  const pronouns = watch("pronouns");
  const completerPathway = watch("completerPathway");
  const graduationYear = watch("graduationYear");
  const yearbookPublic = watch("yearbookPublic");
  const leaderboardOptIn = watch("leaderboardOptIn");

  if (status === "loading" || (status === "authenticated" && !session?.user)) {
    return (
      <div className="text-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const user = session?.user;
  const displayName = preferredName?.trim() || user?.firstName || "";
  const displayNameFull = [displayName, user?.lastName].filter(Boolean).join(" ");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfileImagePreview(url);
  };

  const onComplete = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/student/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredName: preferredName?.trim() || null,
          pronouns: pronouns?.trim() || null,
          completerPathway,
          graduationYear: 2026,
          yearbookPublic,
          leaderboardOptIn,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        form.setError("root", { message: data.error ?? "Setup failed." });
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      form.setError("root", { message: "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg space-y-8">
      <div>
        <Progress value={(step / STEPS) * 100} showLabel />
        <p className="mt-2 text-center text-sm text-white/80">
          Step {step} of {STEPS}
        </p>
      </div>

      <Card className="border-white/20 bg-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-xl">
            {step === 1 && "About you"}
            {step === 2 && "Graduation path"}
            {step === 3 && "Review & preferences"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <p className="text-sm text-white/80">
                Name: <strong>{user?.firstName} {user?.lastName}</strong>
              </p>
              <Input
                label="Preferred name (optional)"
                placeholder="What should we call you?"
                className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                {...register("preferredName")}
              />
              <Input
                label="Pronouns (optional)"
                placeholder="e.g. she/her, he/him, they/them"
                className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                {...register("pronouns")}
              />
              <div>
                <label className="mb-2 block text-sm font-medium">Profile photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="block w-full text-sm text-white/80 file:mr-4 file:rounded file:border-0 file:bg-gold-500 file:px-4 file:py-2 file:text-navy-900"
                />
                {profileImagePreview && (
                  <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-full border-2 border-white/30">
                    <Image
                      src={profileImagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium">Completer pathway</label>
                <select
                  {...register("completerPathway")}
                  className="w-full rounded-button border-2 border-white/30 bg-white/10 px-4 py-3 text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  {(Object.keys(COMPLETER_PATHWAY_LABELS) as CompleterPathway[]).map((key) => (
                    <option key={key} value={key} className="bg-navy-800 text-white">
                      {COMPLETER_PATHWAY_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-white/80">
                Graduation year: <strong>2026</strong>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-white/70">Name</dt>
                  <dd className="font-medium">{displayNameFull || user?.name}</dd>
                </div>
                {pronouns?.trim() && (
                  <div>
                    <dt className="text-white/70">Pronouns</dt>
                    <dd className="font-medium">{pronouns}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-white/70">Pathway</dt>
                  <dd className="font-medium">{COMPLETER_PATHWAY_LABELS[completerPathway as CompleterPathway]}</dd>
                </div>
                <div>
                  <dt className="text-white/70">Graduation year</dt>
                  <dd className="font-medium">{graduationYear}</dd>
                </div>
              </dl>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={yearbookPublic}
                  onChange={(e) => setValue("yearbookPublic", e.target.checked)}
                  className="rounded border-white/30 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-sm">My yearbook page can be public</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={leaderboardOptIn}
                  onChange={(e) => setValue("leaderboardOptIn", e.target.checked)}
                  className="rounded border-white/30 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-sm">Include me on leaderboards</span>
              </label>
              {form.formState.errors.root && (
                <p className="text-sm text-danger">{form.formState.errors.root.message}</p>
              )}
            </>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < STEPS ? (
              <Button
                type="button"
                variant="primary"
                className="bg-gold-500 text-navy-900 hover:bg-gold-400"
                onClick={() => setStep((s) => s + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                className="bg-gold-500 text-navy-900 hover:bg-gold-400"
                onClick={handleSubmit(onComplete)}
                isLoading={submitting}
                loadingText="Completing..."
              >
                Complete Setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
