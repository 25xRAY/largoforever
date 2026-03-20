"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { COUNSELOR_INFO } from "@/lib/constants";

async function fetchTeacherStudents() {
  const res = await fetch("/api/teacher/students");
  if (!res.ok) throw new Error("Failed to load");
  return res.json() as Promise<{
    students: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      preferredName: string | null;
      email: string;
      readiness: { overall: number };
    }[];
  }>;
}

/**
 * Read-only dashboard for linked students (graduation readiness summary only).
 */
export function TeacherDashboardView() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["teacher-students"],
    queryFn: fetchTeacherStudents,
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-10 w-2/3 animate-pulse rounded bg-navy-200" />
        <div className="h-48 w-full animate-pulse rounded-card bg-navy-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-card border-2 border-danger bg-danger-light/30 p-8 text-center">
        <p className="font-medium text-navy-900">Could not load your students.</p>
        <Button variant="primary" size="md" className="mt-4" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const students = data?.students ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">Teacher dashboard</h1>
        <p className="mt-1 text-navy-600">
          View graduation readiness for students linked to your account (read-only).
        </p>
      </div>

      {students.length === 0 ? (
        <div
          className="rounded-card border border-navy-200 bg-white p-8 shadow-card"
          role="status"
        >
          <p className="text-navy-800">
            No students are linked to your account yet. Ask an administrator to connect your roster to
            student accounts, or contact your counselor{" "}
            <a
              href={`mailto:${COUNSELOR_INFO.email}`}
              className="font-medium text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              {COUNSELOR_INFO.name}
            </a>{" "}
            for help.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-navy-200 bg-white shadow-card">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">Linked students and readiness</caption>
            <thead className="border-b border-navy-200 bg-navy-50">
              <tr>
                <th scope="col" className="px-4 py-3 font-heading font-semibold text-navy-900">
                  Student
                </th>
                <th scope="col" className="px-4 py-3 font-heading font-semibold text-navy-900">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 font-heading font-semibold text-navy-900">
                  Readiness
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const display =
                  [s.preferredName || s.firstName, s.lastName].filter(Boolean).join(" ") ||
                  s.email;
                return (
                  <tr key={s.id} className="border-b border-navy-100">
                    <td className="px-4 py-3 font-medium text-navy-900">{display}</td>
                    <td className="px-4 py-3 text-navy-600">{s.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center rounded-full bg-navy-100 px-3 py-1 text-navy-800"
                        aria-label={`Readiness ${s.readiness.overall} percent`}
                      >
                        {s.readiness.overall}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-navy-500">
        You cannot edit checklist data here. For updates, students work with counseling and records.
      </p>
    </div>
  );
}
