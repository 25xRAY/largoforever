"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { AdministratorTitle, TeacherDepartment } from "@prisma/client";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

type ProfileData = {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  preferredName: string | null;
  pronouns: string | null;
  image: string | null;
  role: string;
  seniorGoalsNote: string | null;
  graduationYear: number | null;
  yearbookPublic: boolean;
  leaderboardOptIn: boolean;
  displayGpa: number | null;
  apIbCourseCount: number;
  leadershipRolesJson: string | null;
  honorDesignation: string;
  teacherDepartment: TeacherDepartment | null;
  teacherSubject: string | null;
  administratorTitle: AdministratorTitle | null;
  administratorOffice: string | null;
  profileComplete: boolean;
  createdAt: string;
};

type ToastState = { message: string; type: "success" | "error" } | null;

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Student",
  TEACHER: "Teacher",
  COUNSELOR: "Counselor",
  ADMINISTRATOR: "Administrator",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
};

const HONOR_LABELS: Record<string, string> = {
  NONE: "",
  VALEDICTORIAN: "Valedictorian",
  SALUTATORIAN: "Salutatorian",
};

const PRONOUNS_OPTIONS = [
  "He/Him",
  "She/Her",
  "They/Them",
  "He/They",
  "She/They",
  "Ze/Zir",
  "Prefer not to say",
] as const;

const TEACHER_DEPARTMENTS: { label: string; value: TeacherDepartment }[] = [
  { label: "English", value: "ENGLISH" },
  { label: "Math", value: "MATH" },
  { label: "Science", value: "SCIENCE" },
  { label: "Social Studies", value: "SOCIAL_STUDIES" },
  { label: "Fine Arts", value: "FINE_ARTS" },
  { label: "PE / Health", value: "PE_HEALTH" },
  { label: "CTE", value: "CTE" },
  { label: "Special Education", value: "SPECIAL_EDUCATION" },
  { label: "Other", value: "OTHER" },
];

const ADMINISTRATOR_TITLE_OPTIONS: { label: string; value: AdministratorTitle }[] = [
  { label: "Principal", value: "PRINCIPAL" },
  { label: "Assistant Principal", value: "ASSISTANT_PRINCIPAL" },
  { label: "Department Head", value: "DEPARTMENT_HEAD" },
  { label: "Dean", value: "DEAN" },
  { label: "Other", value: "OTHER" },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-lg font-semibold text-navy-900 mb-4 pb-2 border-b border-navy-100">
      {children}
    </h2>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-navy-800">{label}</label>
      {children}
      {hint && <p className="text-xs text-navy-500">{hint}</p>}
    </div>
  );
}

export function ProfileClient() {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    pronouns: "",
    image: "",
    seniorGoalsNote: "",
    yearbookPublic: true,
    leaderboardOptIn: false,
    displayGpa: "",
    apIbCourseCount: "0",
    leadershipRolesJson: "",
    teacherDepartment: "" as "" | TeacherDepartment,
    teacherSubject: "",
    administratorTitle: "" as "" | AdministratorTitle,
    administratorOffice: "",
  });

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/user/profile");
        const json: unknown = await r.json();
        if (!r.ok) {
          const msg =
            typeof json === "object" && json !== null && "error" in json
              ? String((json as { error: unknown }).error)
              : "Failed to load profile";
          throw new Error(msg);
        }
        if (!cancelled && typeof json === "object" && json !== null && "user" in json) {
          const user = (json as { user: ProfileData }).user;
          setProfile(user);
          setForm({
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            preferredName: user.preferredName ?? "",
            pronouns: user.pronouns ?? "",
            image: user.image ?? "",
            seniorGoalsNote: user.seniorGoalsNote ?? "",
            yearbookPublic: user.yearbookPublic ?? true,
            leaderboardOptIn: user.leaderboardOptIn ?? false,
            displayGpa: user.displayGpa?.toString() ?? "",
            apIbCourseCount: user.apIbCourseCount?.toString() ?? "0",
            leadershipRolesJson: user.leadershipRolesJson ?? "",
            teacherDepartment: user.teacherDepartment ?? "",
            teacherSubject: user.teacherSubject ?? "",
            administratorTitle: user.administratorTitle ?? "",
            administratorOffice: user.administratorOffice ?? "",
          });
        }
      } catch {
        showToast("Failed to load profile.", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  async function handleSave() {
    setSaving(true);
    try {
      const gpaRaw = form.displayGpa.trim();
      const payload: Record<string, unknown> = {
        firstName: form.firstName,
        lastName: form.lastName,
        preferredName: form.preferredName.trim() || null,
        pronouns: form.pronouns.trim() || null,
        image: form.image.trim() || null,
        seniorGoalsNote: form.seniorGoalsNote.trim() || null,
        yearbookPublic: form.yearbookPublic,
        leaderboardOptIn: form.leaderboardOptIn,
        displayGpa: gpaRaw === "" ? null : parseFloat(gpaRaw),
        apIbCourseCount: parseInt(form.apIbCourseCount, 10) || 0,
        leadershipRolesJson: form.leadershipRolesJson.trim() || null,
        teacherDepartment: form.teacherDepartment || null,
        teacherSubject: form.teacherSubject.trim() || null,
        administratorTitle: form.administratorTitle || null,
        administratorOffice: form.administratorOffice.trim() || null,
      };

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err: unknown = await res.json();
        const message =
          typeof err === "object" && err !== null && "error" in err
            ? String((err as { error: unknown }).error)
            : "Save failed";
        throw new Error(message);
      }

      const updatedJson: unknown = await res.json();
      if (typeof updatedJson === "object" && updatedJson !== null && "user" in updatedJson) {
        const updated = (updatedJson as { user: Partial<ProfileData> }).user;
        setProfile((p) => (p ? { ...p, ...updated } : p));
      }

      await updateSession();
      showToast("Profile saved successfully.", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  }

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-card border border-navy-200 bg-white p-6 shadow-card"
            aria-hidden
          >
            <div className="h-5 w-40 bg-navy-100 rounded mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-navy-50 rounded" />
              <div className="h-10 bg-navy-50 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!profile) return null;

  const isTeacher = profile.role === "TEACHER";
  const isStaff = ["ADMINISTRATOR", "COUNSELOR", "ADMIN", "MODERATOR"].includes(profile.role);
  const isStudent = profile.role === "STUDENT";

  const displayName =
    form.preferredName || form.firstName || session?.user?.name || "Your Profile";

  const honorLabel =
    profile.honorDesignation && profile.honorDesignation !== "NONE"
      ? HONOR_LABELS[profile.honorDesignation] ?? profile.honorDesignation
      : null;

  return (
    <div className="space-y-6">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-card shadow-lg text-sm font-medium transition-all ${
            toast.type === "success" ? "bg-success text-white" : "bg-danger text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
        <div className="flex items-start gap-5">
          <div className="relative shrink-0">
            <Avatar
              image={form.image || null}
              name={`${form.firstName} ${form.lastName}`.trim() || session?.user?.name || "?"}
              size="lg"
            />
            {profile.profileComplete && (
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-success ring-2 ring-white">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-heading text-xl font-bold text-navy-900">{displayName}</p>
              <Badge variant="info">{ROLE_LABELS[profile.role] ?? profile.role}</Badge>
              {honorLabel && <Badge variant="success">{honorLabel}</Badge>}
            </div>
            <p className="text-sm text-navy-600 mt-0.5">{profile.email}</p>
            {profile.pronouns && <p className="text-xs text-navy-500 mt-0.5">{profile.pronouns}</p>}
            {!profile.profileComplete && (
              <p className="mt-2 text-xs text-warning-dark font-medium">
                Complete your profile to unlock all features.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
        <SectionHeading>Basic Information</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name">
            <Input
              value={form.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              placeholder="First name"
              aria-label="First name"
            />
          </Field>
          <Field label="Last Name">
            <Input
              value={form.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              placeholder="Last name"
              aria-label="Last name"
            />
          </Field>
          <Field label="Preferred Name" hint="What you&apos;d like to be called">
            <Input
              value={form.preferredName}
              onChange={(e) => setField("preferredName", e.target.value)}
              placeholder="e.g. CJ, Mia, Coach…"
              aria-label="Preferred name"
            />
          </Field>
          <Field label="Pronouns">
            <select
              className="w-full rounded-md border border-navy-300 bg-white px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              value={form.pronouns}
              onChange={(e) => setField("pronouns", e.target.value)}
              aria-label="Pronouns"
            >
              <option value="">Select pronouns…</option>
              {PRONOUNS_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Photo URL"
            hint="Paste a direct image link (Google, school ID photo, etc.)"
          >
            <Input
              value={form.image}
              onChange={(e) => setField("image", e.target.value)}
              placeholder="https://…"
              aria-label="Profile photo URL"
            />
          </Field>
        </div>
      </div>

      {isStudent && (
        <>
          <div className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
            <SectionHeading>Senior Year Goals</SectionHeading>
            <div className="space-y-4">
              <Field
                label="What do you want to accomplish before graduation?"
                hint="Shown on your yearbook page if public. Max 512 characters."
              >
                <textarea
                  className="w-full rounded-md border border-navy-300 bg-white px-3 py-2 text-sm text-navy-900 resize-none focus:outline-none focus:ring-2 focus:ring-gold-500"
                  rows={4}
                  maxLength={512}
                  value={form.seniorGoalsNote}
                  onChange={(e) => setField("seniorGoalsNote", e.target.value)}
                  placeholder="College, career, personal milestones…"
                  aria-label="Senior year goals"
                />
                <p className="text-right text-xs text-navy-500">
                  {form.seniorGoalsNote.length}/512
                </p>
              </Field>
            </div>
          </div>

          <div className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
            <SectionHeading>Academic Highlights</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Display GPA" hint="Optional — shown on leaderboard if opted in">
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  max={5}
                  value={form.displayGpa}
                  onChange={(e) => setField("displayGpa", e.target.value)}
                  placeholder="e.g. 3.85"
                  aria-label="Display GPA"
                />
              </Field>
              <Field label="AP / IB Courses Completed">
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={form.apIbCourseCount}
                  onChange={(e) => setField("apIbCourseCount", e.target.value)}
                  aria-label="AP or IB courses completed count"
                />
              </Field>
              <Field
                label="Leadership Roles"
                hint="Comma-separated: President of NHS, Varsity Captain…"
              >
                <Input
                  value={form.leadershipRolesJson}
                  onChange={(e) => setField("leadershipRolesJson", e.target.value)}
                  placeholder="NHS President, Varsity Captain…"
                  aria-label="Leadership roles"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
            <SectionHeading>Privacy Settings</SectionHeading>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-navy-300 text-gold-500 focus:ring-gold-500"
                  checked={form.yearbookPublic}
                  onChange={(e) => setField("yearbookPublic", e.target.checked)}
                  aria-label="Public yearbook page"
                />
                <div>
                  <p className="text-sm font-medium text-navy-900">Public Yearbook Page</p>
                  <p className="text-xs text-navy-600">
                    Anyone with the link can view your digital yearbook page.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-navy-300 text-gold-500 focus:ring-gold-500"
                  checked={form.leaderboardOptIn}
                  onChange={(e) => setField("leaderboardOptIn", e.target.checked)}
                  aria-label="Appear on leaderboards"
                />
                <div>
                  <p className="text-sm font-medium text-navy-900">Appear on Leaderboards</p>
                  <p className="text-xs text-navy-600">
                    Show your name and GPA on the class leaderboard.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </>
      )}

      {isTeacher && (
        <div className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
          <SectionHeading>Department & Classes</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Department">
              <select
                className="w-full rounded-md border border-navy-300 bg-white px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                value={form.teacherDepartment}
                onChange={(e) =>
                  setField(
                    "teacherDepartment",
                    e.target.value === "" ? "" : (e.target.value as TeacherDepartment)
                  )
                }
                aria-label="Department"
              >
                <option value="">Select department…</option>
                {TEACHER_DEPARTMENTS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Class / Subject" hint="e.g. AP English Literature, Algebra II">
              <Input
                value={form.teacherSubject}
                onChange={(e) => setField("teacherSubject", e.target.value)}
                placeholder="e.g. AP Biology, CTE Web Design…"
                aria-label="Class or subject"
              />
            </Field>
          </div>
        </div>
      )}

      {isStaff && (
        <div className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
          <SectionHeading>Staff Information</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title">
              <select
                className="w-full rounded-md border border-navy-300 bg-white px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                value={form.administratorTitle}
                onChange={(e) =>
                  setField(
                    "administratorTitle",
                    e.target.value === "" ? "" : (e.target.value as AdministratorTitle)
                  )
                }
                aria-label="Staff title"
              >
                <option value="">Select title…</option>
                {ADMINISTRATOR_TITLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Office / Location">
              <Input
                value={form.administratorOffice}
                onChange={(e) => setField("administratorOffice", e.target.value)}
                placeholder="e.g. Main Office, Room 201…"
                aria-label="Office or location"
              />
            </Field>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 z-10 -mx-0 rounded-b-card border-t border-navy-200 bg-white/95 backdrop-blur px-6 py-4 shadow-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-navy-500">
          Member since{" "}
          {new Date(profile.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => void handleSave()}
          disabled={saving}
          className="min-w-[120px]"
          aria-busy={saving}
          aria-label={saving ? "Saving profile" : "Save profile"}
        >
          {saving ? "Saving…" : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
