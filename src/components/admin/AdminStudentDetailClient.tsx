"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

/** Mirrors `UserRole` without importing `@prisma/client` in the browser bundle. */
type UserRole = "STUDENT" | "ADMIN" | "MODERATOR" | "COUNSELOR";
/** Mirrors `HonorDesignation`. */
type HonorDesignation = "NONE" | "VALEDICTORIAN" | "SALUTATORIAN";

interface AuditLite {
  id: string;
  action: string;
  resource: string | null;
  details: string | null;
  createdAt: string;
}

interface StudentDetailResponse {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
    displayGpa: number | null;
    apIbCourseCount: number;
    honorDesignation: HonorDesignation;
    leadershipRolesJson: string | null;
    gradChecklist: {
      englishCredits: number;
      mathCredits: number;
    } | null;
    serviceLearning: { hours: number; verified: boolean } | null;
    wins: { id: string; title: string; type: string; approved: boolean }[];
    yearbookPage: { slug: string; headline: string | null; status: string } | null;
    leaderboardPreferences: { category: string; optedIn: boolean; verified: boolean }[];
    auditLogs: AuditLite[];
  };
}

async function fetchStudent(id: string): Promise<StudentDetailResponse> {
  const res = await fetch(`/api/admin/students/${id}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

const ROLES = ["STUDENT", "ADMIN", "MODERATOR", "COUNSELOR"] as const satisfies readonly UserRole[];
const HONORS = [
  "NONE",
  "VALEDICTORIAN",
  "SALUTATORIAN",
] as const satisfies readonly HonorDesignation[];

/**
 * Staff student profile with verified-only checklist edits and recent audit entries.
 */
export function AdminStudentDetailClient({ studentId }: { studentId: string }) {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-student", studentId],
    queryFn: () => fetchStudent(studentId),
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayGpa, setDisplayGpa] = useState("");
  const [apIb, setApIb] = useState("");
  const [honor, setHonor] = useState<HonorDesignation>("NONE");
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [englishCredits, setEnglishCredits] = useState("");
  const [mathCredits, setMathCredits] = useState("");
  const [serviceHours, setServiceHours] = useState("");
  const [serviceVerified, setServiceVerified] = useState(false);
  const [leadershipJson, setLeadershipJson] = useState("");
  const [staffNotes, setStaffNotes] = useState("");
  const [verifiedOk, setVerifiedOk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.user) return;
    const u = data.user;
    setFirstName(u.firstName ?? "");
    setLastName(u.lastName ?? "");
    setDisplayGpa(u.displayGpa != null ? String(u.displayGpa) : "");
    setApIb(String(u.apIbCourseCount));
    setHonor(u.honorDesignation);
    setRole(u.role);
    setEnglishCredits(u.gradChecklist != null ? String(u.gradChecklist.englishCredits) : "");
    setMathCredits(u.gradChecklist != null ? String(u.gradChecklist.mathCredits) : "");
    setServiceHours(u.serviceLearning != null ? String(u.serviceLearning.hours) : "");
    setServiceVerified(u.serviceLearning?.verified ?? false);
    setLeadershipJson(u.leadershipRolesJson ?? "");
  }, [data]);

  const save = useCallback(async () => {
    if (!verifiedOk) {
      setSaveMsg("Confirm verification against official records before saving.");
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const gpaNum = displayGpa.trim() === "" ? null : Number(displayGpa);
      if (displayGpa.trim() !== "" && Number.isNaN(gpaNum)) {
        setSaveMsg("Display GPA must be a number.");
        setSaving(false);
        return;
      }
      const body: Record<string, unknown> = {
        verifiedAgainstOfficialRecords: true,
        ...(staffNotes.trim() ? { staffNotes: staffNotes.trim() } : {}),
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        displayGpa: gpaNum,
        apIbCourseCount: Number.parseInt(apIb, 10) || 0,
        honorDesignation: honor,
        role,
        englishCredits: Number.parseFloat(englishCredits) || 0,
        mathCredits: Number.parseFloat(mathCredits) || 0,
        serviceHours: Number.parseFloat(serviceHours) || 0,
        serviceVerified,
        leadershipRolesJson: leadershipJson.trim() === "" ? null : leadershipJson.trim(),
      };

      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setSaveMsg((j as { error?: string }).error ?? "Save failed");
        return;
      }
      setStaffNotes("");
      setVerifiedOk(false);
      setSaveMsg("Saved. Changes are logged.");
      void qc.invalidateQueries({ queryKey: ["admin-student", studentId] });
      void qc.invalidateQueries({ queryKey: ["admin-students"] });
    } catch {
      setSaveMsg("Network error.");
    } finally {
      setSaving(false);
    }
  }, [
    verifiedOk,
    staffNotes,
    firstName,
    lastName,
    displayGpa,
    apIb,
    honor,
    role,
    englishCredits,
    mathCredits,
    serviceHours,
    serviceVerified,
    leadershipJson,
    studentId,
    qc,
  ]);

  if (isLoading)
    return <div className="h-64 animate-pulse rounded-card bg-navy-100" aria-busy="true" />;
  if (error || !data?.user) return <p className="text-danger-dark">Student not found.</p>;

  const u = data.user;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/students"
          className="text-sm font-medium text-navy-600 underline hover:text-navy-800"
        >
          ← All students
        </Link>
        <h1 className="mt-4 font-heading text-2xl font-bold text-navy-900">
          {[u.firstName, u.lastName].filter(Boolean).join(" ") || u.email}
        </h1>
        <p className="text-sm text-navy-600">{u.email}</p>
      </div>

      <section className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Profile & display</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-navy-800">First name</span>
            <input
              className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 text-sm"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-navy-800">Last name</span>
            <input
              className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 text-sm"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-navy-800">Display GPA (leaderboard honors)</span>
            <input
              className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 text-sm"
              value={displayGpa}
              onChange={(e) => setDisplayGpa(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-navy-800">AP/IB course count</span>
            <input
              className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 text-sm"
              value={apIb}
              onChange={(e) => setApIb(e.target.value)}
              inputMode="numeric"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-navy-800">Honor designation</span>
            <select
              className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 text-sm"
              value={honor}
              onChange={(e) => setHonor(e.target.value as HonorDesignation)}
            >
              {HONORS.map((h) => (
                <option key={h} value={h}>
                  {h.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-navy-800">Role</span>
            <select
              className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-4 block text-sm">
          <span className="font-medium text-navy-800">Leadership roles (JSON array)</span>
          <textarea
            className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 font-mono text-xs"
            rows={4}
            value={leadershipJson}
            onChange={(e) => setLeadershipJson(e.target.value)}
            spellCheck={false}
          />
        </label>
      </section>

      <section className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Credits & service</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-navy-800">English credits</span>
            <input
              className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 text-sm"
              value={englishCredits}
              onChange={(e) => setEnglishCredits(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-navy-800">Math credits</span>
            <input
              className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 text-sm"
              value={mathCredits}
              onChange={(e) => setMathCredits(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-navy-800">Service hours</span>
            <input
              className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 text-sm"
              value={serviceHours}
              onChange={(e) => setServiceHours(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <label className="flex items-center gap-2 text-sm pt-6">
            <input
              type="checkbox"
              checked={serviceVerified}
              onChange={(e) => setServiceVerified(e.target.checked)}
            />
            <span className="font-medium text-navy-800">Service hours verified</span>
          </label>
        </div>
      </section>

      <section className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Staff attestation</h2>
        <label className="mt-3 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={verifiedOk}
            onChange={(e) => setVerifiedOk(e.target.checked)}
            className="mt-1"
          />
          <span>
            I confirm these values were verified against official records (required for every save).
          </span>
        </label>
        <label className="mt-4 block text-sm">
          <span className="font-medium text-navy-800">Staff notes (optional)</span>
          <textarea
            className="mt-1 w-full rounded-button border border-navy-200 px-3 py-2 text-sm"
            rows={2}
            value={staffNotes}
            onChange={(e) => setStaffNotes(e.target.value)}
          />
        </label>
        {saveMsg && <p className="mt-3 text-sm text-navy-800">{saveMsg}</p>}
        <Button
          type="button"
          variant="primary"
          className="mt-4"
          disabled={saving}
          onClick={() => void save()}
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </section>

      <section className="rounded-card border border-navy-200 bg-navy-50 p-6">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Recent wins</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {u.wins.length === 0 ? (
            <li className="text-navy-600">None</li>
          ) : (
            u.wins.map((w) => (
              <li key={w.id}>
                {w.title} <span className="text-navy-500">({w.type})</span>{" "}
                {w.approved ? "✓" : "pending"}
              </li>
            ))
          )}
        </ul>
        {u.yearbookPage && (
          <p className="mt-4 text-sm">
            <strong>Yearbook:</strong> {u.yearbookPage.headline} —{" "}
            <Link href={`/yearbook/${u.yearbookPage.slug}`} className="underline">
              /yearbook/{u.yearbookPage.slug}
            </Link>{" "}
            ({u.yearbookPage.status})
          </p>
        )}
      </section>

      <section className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
        <h2 className="font-heading text-lg font-semibold text-navy-900">
          Leaderboard preferences
        </h2>
        <ul className="mt-3 space-y-1 text-sm text-navy-700">
          {u.leaderboardPreferences.length === 0 ? (
            <li>None on file</li>
          ) : (
            u.leaderboardPreferences.map((p) => (
              <li key={p.category}>
                {p.category}: opted in {p.optedIn ? "yes" : "no"}, verified{" "}
                {p.verified ? "yes" : "no"}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Activity (latest)</h2>
        <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-xs text-navy-700">
          {u.auditLogs.map((a) => (
            <li key={a.id} className="border-b border-navy-100 pb-2">
              <span className="font-medium text-navy-900">{a.action}</span> ·{" "}
              {new Date(a.createdAt).toLocaleString()}
              {a.details && (
                <pre className="mt-1 max-h-24 overflow-auto whitespace-pre-wrap break-all text-[10px] text-navy-600">
                  {a.details}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
