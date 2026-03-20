"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingSchema,
  teacherOnboardingSchema,
  type OnboardingInput,
  type TeacherOnboardingInput,
} from "@/lib/validations/auth";
import { Button, Input, Progress } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { CompleterPathway, TeacherDepartment } from "@prisma/client";

const PATHWAY_SELECT_ORDER: CompleterPathway[] = [
  "STEM",
  "HEALTH",
  "BUSINESS",
  "ARTS_MEDIA",
  "IT",
  "CONSTRUCTION",
  "EDUCATION",
  "PUBLIC_SERVICE",
  "UNDECIDED",
];

const COMPLETER_PATHWAY_LABELS: Record<CompleterPathway, string> = {
  STEM: "STEM",
  HEALTH: "Health",
  BUSINESS: "Business",
  ARTS_MEDIA: "Arts & Media",
  IT: "Information Technology",
  CONSTRUCTION: "Construction",
  EDUCATION: "Education",
  PUBLIC_SERVICE: "Public Service",
  UNDECIDED: "Not Sure Yet",
};

const TEACHER_DEPT_ORDER: TeacherDepartment[] = [
  "ENGLISH",
  "MATH",
  "SCIENCE",
  "SOCIAL_STUDIES",
  "FINE_ARTS",
  "PE_HEALTH",
  "CTE",
  "SPECIAL_EDUCATION",
  "OTHER",
];

const TEACHER_DEPARTMENT_LABELS: Record<TeacherDepartment, string> = {
  ENGLISH: "English",
  MATH: "Math",
  SCIENCE: "Science",
  SOCIAL_STUDIES: "Social Studies",
  FINE_ARTS: "Fine Arts",
  PE_HEALTH: "PE / Health",
  CTE: "CTE",
  SPECIAL_EDUCATION: "Special Education",
  OTHER: "Other",
};

const STUDENT_STEPS = 3;
const TEACHER_STEPS = 3;

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      setCheckingProfile(false);
      return;
    }
    let cancelled = false;
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((d: { profileComplete?: boolean }) => {
        if (!cancelled && d.profileComplete) {
          router.replace("/dashboard");
        }
      })
      .finally(() => {
        if (!cancelled) setCheckingProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, session, router]);

  if (status === "loading" || checkingProfile || (status === "authenticated" && !session?.user)) {
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

  const isTeacher = session!.user.role === "TEACHER";

  if (isTeacher) {
    return (
      <TeacherOnboardingForm
        session={session!}
        router={router}
        onSessionRefresh={() => update()}
      />
    );
  }

  return <StudentOnboardingForm session={session!} router={router} />;
}

function TeacherOnboardingForm({
  session,
  router,
  onSessionRefresh,
}: {
  session: NonNullable<ReturnType<typeof useSession>["data"]>;
  router: ReturnType<typeof useRouter>;
  onSessionRefresh: () => void;
}) {
  const [step, setStep] = useState(1);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<TeacherOnboardingInput>({
    resolver: zodResolver(teacherOnboardingSchema),
    defaultValues: {
      preferredName: "",
      pronouns: "",
      teacherDepartment: "OTHER",
      teacherSubject: "",
      yearbookPublic: false,
      leaderboardOptIn: false,
    },
  });

  const { register, handleSubmit, watch, setValue } = form;
  const preferredName = watch("preferredName");
  const pronouns = watch("pronouns");
  const teacherDepartment = watch("teacherDepartment");
  const teacherSubject = watch("teacherSubject");
  const yearbookPublic = watch("yearbookPublic");
  const leaderboardOptIn = watch("leaderboardOptIn");

  const user = session.user;
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
      const res = await fetch("/api/teacher/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredName: preferredName?.trim() || null,
          pronouns: pronouns?.trim() || null,
          teacherDepartment,
          teacherSubject,
          yearbookPublic,
          leaderboardOptIn,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        form.setError("root", { message: data.error ?? "Setup failed." });
        return;
      }
      onSessionRefresh();
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
        <Progress value={(step / TEACHER_STEPS) * 100} showLabel />
        <p className="mt-2 text-center text-sm text-white/80">
          Step {step} of {TEACHER_STEPS}
        </p>
      </div>

      <Card className="border-white/20 bg-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-xl">
            {step === 1 && "About you"}
            {step === 2 && "Teaching"}
            {step === 3 && "Review & preferences"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <p className="text-sm text-white/80">
                Name:{" "}
                <strong>
                  {user?.firstName} {user?.lastName}
                </strong>
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
                  aria-label="Upload profile photo"
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
                <label htmlFor="teacher-dept" className="mb-2 block text-sm font-medium">
                  Department
                </label>
                <select
                  id="teacher-dept"
                  {...register("teacherDepartment")}
                  className="w-full rounded-button border-2 border-white/30 bg-white/10 px-4 py-3 text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  {TEACHER_DEPT_ORDER.map((key) => (
                    <option key={key} value={key} className="bg-navy-800 text-white">
                      {TEACHER_DEPARTMENT_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Class / subject"
                placeholder="e.g. English 10 — Room 112"
                className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                errorMessage={form.formState.errors.teacherSubject?.message}
                {...register("teacherSubject")}
              />
              <p className="text-sm text-white/80">
                Graduation pathway questions are for students only; you can skip them here.
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
                  <dt className="text-white/70">Department</dt>
                  <dd className="font-medium">{TEACHER_DEPARTMENT_LABELS[teacherDepartment]}</dd>
                </div>
                <div>
                  <dt className="text-white/70">Class / subject</dt>
                  <dd className="font-medium">{teacherSubject}</dd>
                </div>
              </dl>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={yearbookPublic}
                  onChange={(e) => setValue("yearbookPublic", e.target.checked)}
                  className="rounded border-white/30 text-gold-500 focus:ring-gold-500"
                  aria-label="Allow public yearbook visibility"
                />
                <span className="text-sm">My yearbook page can be public</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={leaderboardOptIn}
                  onChange={(e) => setValue("leaderboardOptIn", e.target.checked)}
                  className="rounded border-white/30 text-gold-500 focus:ring-gold-500"
                  aria-label="Opt in to leaderboards"
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
            {step < TEACHER_STEPS ? (
              <Button
                type="button"
                variant="primary"
                className="bg-gold-500 text-navy-900 hover:bg-gold-400"
                onClick={async () => {
                  if (step === 2) {
                    const ok = await form.trigger(["teacherDepartment", "teacherSubject"]);
                    if (!ok) return;
                  }
                  setStep((s) => s + 1);
                }}
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

function StudentOnboardingForm({
  session,
  router,
}: {
  session: NonNullable<ReturnType<typeof useSession>["data"]>;
  router: ReturnType<typeof useRouter>;
}) {
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

  const user = session.user;
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
        <Progress value={(step / STUDENT_STEPS) * 100} showLabel />
        <p className="mt-2 text-center text-sm text-white/80">
          Step {step} of {STUDENT_STEPS}
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
                Name:{" "}
                <strong>
                  {user?.firstName} {user?.lastName}
                </strong>
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
                  aria-label="Upload profile photo"
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
                <label htmlFor="completer-pathway" className="mb-2 block text-sm font-medium">
                  Completer pathway
                </label>
                <select
                  id="completer-pathway"
                  {...register("completerPathway")}
                  className="w-full rounded-button border-2 border-white/30 bg-white/10 px-4 py-3 text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  {PATHWAY_SELECT_ORDER.map((key) => (
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
                  <dd className="font-medium">
                    {COMPLETER_PATHWAY_LABELS[completerPathway as CompleterPathway]}
                  </dd>
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
                  aria-label="Allow public yearbook page"
                />
                <span className="text-sm">My yearbook page can be public</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={leaderboardOptIn}
                  onChange={(e) => setValue("leaderboardOptIn", e.target.checked)}
                  className="rounded border-white/30 text-gold-500 focus:ring-gold-500"
                  aria-label="Opt in to leaderboards"
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
            {step < STUDENT_STEPS ? (
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
