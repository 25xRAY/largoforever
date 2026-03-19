"use client";

import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PrefRow {
  category: string;
  optedIn: boolean;
  verified: boolean;
}

interface LeaderboardUserRow {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  displayGpa: number | null;
  honorDesignation: string | null;
  serviceLearning: { hours: number; verified: boolean } | null;
  leaderboardPreferences: PrefRow[];
}

interface LeaderboardListResponse {
  users: LeaderboardUserRow[];
}

async function fetchLeaderboards(): Promise<LeaderboardListResponse> {
  const res = await fetch("/api/admin/leaderboards");
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

const VERIFY_CATS = [
  { api: "gpa" as const, label: "GPA board" },
  { api: "service" as const, label: "Service" },
  { api: "academic_challenge" as const, label: "AP/IB" },
  { api: "leadership" as const, label: "Leadership" },
];

function honorToApi(value: string): "NONE" | "VALEDICTORIAN" | "SALUTATORIAN" {
  const v = value.toUpperCase();
  if (v === "VALEDICTORIAN") return "VALEDICTORIAN";
  if (v === "SALUTATORIAN") return "SALUTATORIAN";
  return "NONE";
}

/**
 * Assign honors, verify leaderboard opt-ins, and bulk-verify service hours.
 */
export function AdminLeaderboardsClient() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-leaderboards"],
    queryFn: fetchLeaderboards,
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Set<string>>(() => new Set());

  const post = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch("/api/admin/leaderboards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error((j as { error?: string }).error ?? "Request failed");
    }
  }, []);

  const setHonor = useCallback(
    async (userId: string, designation: string) => {
      const key = `honor-${userId}`;
      setBusy(key);
      try {
        await post({
          kind: "honor",
          userId,
          designation: honorToApi(designation),
        });
        void qc.invalidateQueries({ queryKey: ["admin-leaderboards"] });
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed");
      } finally {
        setBusy(null);
      }
    },
    [post, qc]
  );

  const setVerifyPref = useCallback(
    async (userId: string, category: (typeof VERIFY_CATS)[number]["api"], verified: boolean) => {
      const key = `v-${userId}-${category}`;
      setBusy(key);
      try {
        await post({ kind: "verify_pref", userId, category, verified });
        void qc.invalidateQueries({ queryKey: ["admin-leaderboards"] });
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed");
      } finally {
        setBusy(null);
      }
    },
    [post, qc]
  );

  const bulkService = useCallback(async () => {
    const ids = Array.from(selectedService);
    if (ids.length === 0) return;
    setBusy("bulk-svc");
    try {
      await post({ kind: "bulk_verify_service", userIds: ids });
      setSelectedService(new Set());
      void qc.invalidateQueries({ queryKey: ["admin-leaderboards"] });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  }, [post, qc, selectedService]);

  const toggleSvc = useCallback((id: string) => {
    setSelectedService((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  if (isLoading)
    return <div className="h-64 animate-pulse rounded-card bg-navy-100" aria-busy="true" />;
  if (error || !data)
    return <p className="text-danger-dark">Could not load leaderboard admin data.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">Leaderboards</h1>
        <p className="mt-1 text-sm text-navy-600">
          Assign valedictorian / salutatorian, verify opt-in categories, and bulk-verify logged
          service hours.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-card border border-navy-200 bg-navy-50 p-4">
        <span className="text-sm font-medium text-navy-800">
          Bulk verify service hours for selected students
        </span>
        <button
          type="button"
          className="rounded-button bg-navy-500 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-600 disabled:opacity-50"
          disabled={selectedService.size === 0 || busy === "bulk-svc"}
          onClick={() => void bulkService()}
        >
          Verify selected ({selectedService.size})
        </button>
      </div>

      <div className="overflow-x-auto rounded-card border border-navy-200">
        <table className="min-w-[960px] w-full text-left text-xs">
          <thead className="bg-navy-50">
            <tr>
              <th className="px-2 py-2 font-semibold text-navy-900">Svc bulk</th>
              <th className="px-2 py-2 font-semibold text-navy-900">Student</th>
              <th className="px-2 py-2 font-semibold text-navy-900">Display GPA</th>
              <th className="px-2 py-2 font-semibold text-navy-900">Honor</th>
              <th className="px-2 py-2 font-semibold text-navy-900">Service</th>
              {VERIFY_CATS.map((c) => (
                <th key={c.api} className="px-2 py-2 font-semibold text-navy-900">
                  {c.label} ✓
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.users.map((u) => {
              const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email;
              const svc = u.serviceLearning;
              const prefVerified = (cat: string) =>
                u.leaderboardPreferences.find((p) => p.category === cat)?.verified ?? false;

              const honorSelectValue =
                u.honorDesignation === "valedictorian"
                  ? "VALEDICTORIAN"
                  : u.honorDesignation === "salutatorian"
                    ? "SALUTATORIAN"
                    : "NONE";

              return (
                <tr key={u.id} className="border-t border-navy-100">
                  <td className="px-2 py-2">
                    <input
                      type="checkbox"
                      checked={selectedService.has(u.id)}
                      onChange={() => toggleSvc(u.id)}
                      disabled={!svc || svc.verified}
                      aria-label={`Include ${name} in bulk service verify`}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <div className="font-medium text-navy-900">{name}</div>
                    <div className="text-navy-600">{u.email}</div>
                  </td>
                  <td className="px-2 py-2 text-navy-800">{u.displayGpa ?? "—"}</td>
                  <td className="px-2 py-2">
                    <select
                      className="max-w-[140px] rounded border border-navy-200 px-1 py-1"
                      value={honorSelectValue}
                      disabled={busy === `honor-${u.id}`}
                      onChange={(e) => void setHonor(u.id, e.target.value)}
                    >
                      <option value="NONE">None</option>
                      <option value="VALEDICTORIAN">Valedictorian</option>
                      <option value="SALUTATORIAN">Salutatorian</option>
                    </select>
                  </td>
                  <td className="px-2 py-2 text-navy-800">
                    {svc ? `${svc.hours}h · ${svc.verified ? "verified" : "not verified"}` : "—"}
                  </td>
                  {VERIFY_CATS.map((c) => {
                    const catEnum =
                      c.api === "gpa"
                        ? "GPA"
                        : c.api === "service"
                          ? "SERVICE"
                          : c.api === "academic_challenge"
                            ? "ACADEMIC_CHALLENGE"
                            : "LEADERSHIP";
                    const ok = prefVerified(catEnum);
                    return (
                      <td key={c.api} className="px-2 py-2">
                        <button
                          type="button"
                          className={`rounded px-2 py-1 text-[10px] font-semibold ${
                            ok
                              ? "bg-success/20 text-success-dark"
                              : "bg-navy-100 text-navy-700 hover:bg-navy-200"
                          }`}
                          disabled={busy === `v-${u.id}-${c.api}`}
                          onClick={() => void setVerifyPref(u.id, c.api, !ok)}
                        >
                          {ok ? "Verified" : "Mark verified"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
