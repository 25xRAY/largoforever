"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface StudentRow {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  readiness: number;
  displayGpa: number | null;
  honorDesignation: string | null;
}

interface ListResponse {
  data: StudentRow[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

async function fetchStudents(page: number, q: string): Promise<ListResponse> {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (q.trim()) params.set("q", q.trim());
  const res = await fetch(`/api/admin/students?${params}`);
  if (!res.ok) throw new Error("Failed to load students");
  return res.json();
}

/**
 * Paginated staff directory of students with readiness and GPA display fields.
 */
export function AdminStudentsTableClient() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-students", page, q],
    queryFn: () => fetchStudents(page, q),
  });

  const applySearch = useCallback(() => {
    setPage(1);
    setQ(searchInput);
  }, [searchInput]);

  if (isLoading)
    return <div className="h-64 animate-pulse rounded-card bg-navy-100" aria-busy="true" />;
  if (error || !data) return <p className="text-danger-dark">Could not load students.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">Students</h1>
        <p className="mt-1 text-sm text-navy-600">
          Search and open a profile to edit checklist fields (verified changes only).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <label htmlFor="student-search" className="sr-only">
          Search students
        </label>
        <input
          id="student-search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          placeholder="Name or email…"
          className="min-w-[200px] flex-1 rounded-button border-2 border-navy-200 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
        <Button type="button" variant="secondary" onClick={applySearch}>
          Search
        </Button>
        <Button type="button" variant="outline" onClick={() => void refetch()}>
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto rounded-card border border-navy-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-navy-50">
            <tr>
              <th className="px-3 py-2 font-semibold text-navy-900">Name</th>
              <th className="px-3 py-2 font-semibold text-navy-900">Email</th>
              <th className="px-3 py-2 font-semibold text-navy-900">Readiness</th>
              <th className="px-3 py-2 font-semibold text-navy-900">Display GPA</th>
              <th className="px-3 py-2 font-semibold text-navy-900">Honor</th>
              <th className="px-3 py-2 font-semibold text-navy-900"> </th>
            </tr>
          </thead>
          <tbody>
            {data.data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-navy-600">
                  No students match this search.
                </td>
              </tr>
            ) : (
              data.data.map((s) => (
                <tr key={s.id} className="border-t border-navy-100 hover:bg-navy-50/80">
                  <td className="px-3 py-2 font-medium text-navy-900">
                    {[s.firstName, s.lastName].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-3 py-2 text-navy-700">{s.email}</td>
                  <td className="px-3 py-2 text-navy-700">{s.readiness}%</td>
                  <td className="px-3 py-2 text-navy-700">{s.displayGpa ?? "—"}</td>
                  <td className="px-3 py-2 text-navy-700 capitalize">
                    {s.honorDesignation?.replace(/_/g, " ") ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/students/${s.id}`}
                      className="font-medium text-navy-600 underline hover:text-navy-800"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-navy-700">
        <span>
          Page {data.page} · {data.total} total
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!data.hasMore}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
