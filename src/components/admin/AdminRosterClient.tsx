"use client";

import { useCallback, useEffect, useState } from "react";
import type { ApprovedRoster, UserRole } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const ROLES: UserRole[] = ["STUDENT", "TEACHER", "ADMIN", "MODERATOR", "COUNSELOR"];

type FilterUsed = "" | "true" | "false";

export function AdminRosterClient() {
  const [entries, setEntries] = useState<ApprovedRoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usedFilter, setUsedFilter] = useState<FilterUsed>("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [search, setSearch] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addFirst, setAddFirst] = useState("");
  const [addLast, setAddLast] = useState("");
  const [addRole, setAddRole] = useState<UserRole>("STUDENT");
  const [addBusy, setAddBusy] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [linkTeacher, setLinkTeacher] = useState("");
  const [linkStudent, setLinkStudent] = useState("");
  const [linkBusy, setLinkBusy] = useState(false);
  const [linkMessage, setLinkMessage] = useState<string | null>(null);

  const queryString = useCallback(() => {
    const p = new URLSearchParams();
    if (usedFilter) p.set("used", usedFilter);
    if (roleFilter) p.set("role", roleFilter);
    if (search.trim()) p.set("q", search.trim());
    return p.toString();
  }, [usedFilter, roleFilter, search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = queryString();
      const res = await fetch(`/api/admin/roster${qs ? `?${qs}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Load failed");
      setEntries(data.entries ?? []);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: addEmail,
          firstName: addFirst,
          lastName: addLast,
          role: addRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setAddEmail("");
      setAddFirst("");
      setAddLast("");
      await load();
    } catch (err) {
      setError(String(err));
    } finally {
      setAddBusy(false);
    }
  }

  async function handleBulk(file: File | null) {
    if (!file) return;
    setBulkBusy(true);
    setError(null);
    try {
      const text = await file.text();
      const res = await fetch("/api/admin/roster/bulk", {
        method: "POST",
        headers: { "Content-Type": "text/csv; charset=utf-8" },
        body: text,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      await load();
    } catch (err) {
      setError(String(err));
    } finally {
      setBulkBusy(false);
    }
  }

  function exportCsv() {
    const qs = queryString();
    window.open(`/api/admin/roster?${qs ? `${qs}&` : ""}format=csv`, "_blank", "noopener,noreferrer");
  }

  async function handleLink(e: React.FormEvent) {
    e.preventDefault();
    setLinkBusy(true);
    setLinkMessage(null);
    try {
      const res = await fetch("/api/admin/teacher-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherEmail: linkTeacher, studentEmail: linkStudent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Link failed");
      setLinkMessage("Link saved.");
      setLinkTeacher("");
      setLinkStudent("");
    } catch (err) {
      setLinkMessage(String(err));
    } finally {
      setLinkBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">Approved roster</h1>
        <p className="mt-1 text-navy-600">
          Students and staff must appear here before they can register or sign in with Google
          (production).
        </p>
      </div>

      {error && (
        <p className="rounded-card border border-danger bg-danger-light/30 p-3 text-sm text-navy-900">
          {error}
        </p>
      )}

      <section
        className="rounded-card border border-navy-200 bg-white p-6 shadow-card"
        aria-labelledby="roster-filters-heading"
      >
        <h2 id="roster-filters-heading" className="font-heading text-lg font-semibold text-navy-900">
          Search &amp; filter
        </h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <Input
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Email or name"
            className="min-w-[200px]"
          />
          <div>
            <label htmlFor="used-filter" className="mb-1 block text-sm font-medium text-navy-800">
              Used status
            </label>
            <select
              id="used-filter"
              value={usedFilter}
              onChange={(e) => setUsedFilter(e.target.value as FilterUsed)}
              className="rounded-button border-2 border-navy-200 px-3 py-2 text-navy-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">All</option>
              <option value="true">Used</option>
              <option value="false">Unused</option>
            </select>
          </div>
          <div>
            <label htmlFor="role-filter" className="mb-1 block text-sm font-medium text-navy-800">
              Role
            </label>
            <select
              id="role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}
              className="rounded-button border-2 border-navy-200 px-3 py-2 text-navy-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">All</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button type="button" variant="primary" onClick={() => void load()}>
              Apply
            </Button>
            <Button type="button" variant="outline" onClick={exportCsv}>
              Export CSV
            </Button>
          </div>
        </div>
      </section>

      <section
        className="rounded-card border border-navy-200 bg-white p-6 shadow-card"
        aria-labelledby="add-roster-heading"
      >
        <h2 id="add-roster-heading" className="font-heading text-lg font-semibold text-navy-900">
          Add person
        </h2>
        <form onSubmit={handleAdd} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Email"
            type="email"
            required
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            autoComplete="off"
          />
          <Input
            label="First name"
            required
            value={addFirst}
            onChange={(e) => setAddFirst(e.target.value)}
          />
          <Input
            label="Last name"
            required
            value={addLast}
            onChange={(e) => setAddLast(e.target.value)}
          />
          <div>
            <label htmlFor="add-role" className="mb-1 block text-sm font-medium text-navy-800">
              Role
            </label>
            <select
              id="add-role"
              value={addRole}
              onChange={(e) => setAddRole(e.target.value as UserRole)}
              className="w-full rounded-button border-2 border-navy-200 px-3 py-2 text-navy-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" isLoading={addBusy} loadingText="Saving…">
              Add to roster
            </Button>
          </div>
        </form>
      </section>

      <section
        className="rounded-card border border-navy-200 bg-white p-6 shadow-card"
        aria-labelledby="bulk-roster-heading"
      >
        <h2 id="bulk-roster-heading" className="font-heading text-lg font-semibold text-navy-900">
          Bulk import CSV
        </h2>
        <p className="mt-1 text-sm text-navy-600">
          Header row: email, firstName, lastName, role (uppercase enum, e.g. STUDENT).
        </p>
        <div className="mt-4">
          <input
            type="file"
            accept=".csv,text/csv"
            aria-label="Upload roster CSV file"
            disabled={bulkBusy}
            onChange={(e) => void handleBulk(e.target.files?.[0] ?? null)}
            className="text-sm text-navy-800 file:mr-4 file:rounded-button file:border-0 file:bg-gold-500 file:px-4 file:py-2 file:font-medium file:text-navy-900"
          />
        </div>
      </section>

      <section
        className="rounded-card border border-navy-200 bg-white p-6 shadow-card"
        aria-labelledby="teacher-link-heading"
      >
        <h2 id="teacher-link-heading" className="font-heading text-lg font-semibold text-navy-900">
          Link teacher ↔ student
        </h2>
        <p className="mt-1 text-sm text-navy-600">
          Teachers see read-only readiness for linked student accounts on their dashboard.
        </p>
        <form onSubmit={handleLink} className="mt-4 flex flex-wrap items-end gap-4">
          <Input
            label="Teacher email"
            type="email"
            required
            value={linkTeacher}
            onChange={(e) => setLinkTeacher(e.target.value)}
          />
          <Input
            label="Student email"
            type="email"
            required
            value={linkStudent}
            onChange={(e) => setLinkStudent(e.target.value)}
          />
          <Button type="submit" variant="secondary" isLoading={linkBusy} loadingText="Saving…">
            Save link
          </Button>
        </form>
        {linkMessage && (
          <p className="mt-2 text-sm text-navy-700" role="status">
            {linkMessage}
          </p>
        )}
      </section>

      <section aria-labelledby="roster-table-heading">
        <h2 id="roster-table-heading" className="sr-only">
          Roster entries
        </h2>
        {loading ? (
          <p className="text-navy-600">Loading…</p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-navy-200 bg-white shadow-card">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-navy-200 bg-navy-50">
                <tr>
                  <th className="px-4 py-3 font-heading font-semibold text-navy-900">Email</th>
                  <th className="px-4 py-3 font-heading font-semibold text-navy-900">Name</th>
                  <th className="px-4 py-3 font-heading font-semibold text-navy-900">Role</th>
                  <th className="px-4 py-3 font-heading font-semibold text-navy-900">Used</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((row) => (
                  <tr key={row.id} className="border-b border-navy-100">
                    <td className="px-4 py-3 text-navy-800">{row.email}</td>
                    <td className="px-4 py-3 text-navy-800">
                      {row.firstName} {row.lastName}
                    </td>
                    <td className="px-4 py-3 text-navy-800">{row.role}</td>
                    <td className="px-4 py-3 text-navy-800">{row.used ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {entries.length === 0 && (
              <p className="p-6 text-center text-navy-600">No entries match your filters.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
