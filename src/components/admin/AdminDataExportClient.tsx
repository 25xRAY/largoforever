"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Staff exports: CSV downloads and yearbook JSON payload.
 */
export function AdminDataExportClient() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const rangeBody = useCallback(() => {
    if (!from || !to) return {};
    return {
      dateRange: {
        from: new Date(`${from}T00:00:00.000Z`).toISOString(),
        to: new Date(`${to}T23:59:59.999Z`).toISOString(),
      },
    };
  }, [from, to]);

  const runExport = useCallback(
    async (type: "students" | "wins" | "yearbook" | "audit", filename: string) => {
      setBusy(type);
      setMessage(null);
      try {
        const res = await fetch("/api/admin/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, ...rangeBody() }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setMessage((j as { error?: string }).error ?? "Export failed");
          return;
        }
        const ct = res.headers.get("Content-Type") ?? "";
        if (type === "yearbook") {
          const data = await res.json();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          downloadBlob(blob, filename);
        } else if (ct.includes("text/csv")) {
          const blob = await res.blob();
          downloadBlob(blob, filename);
        } else {
          const text = await res.text();
          downloadBlob(new Blob([text], { type: "text/csv" }), filename);
        }
        setMessage(`Downloaded ${filename}`);
      } catch {
        setMessage("Network error");
      } finally {
        setBusy(null);
      }
    },
    [rangeBody]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">Data export</h1>
        <p className="mt-1 text-sm text-navy-600">
          Wins and audit logs honor the date range. Student extract is full roster. Yearbook returns
          JSON for the selected update window.
        </p>
      </div>

      <section className="rounded-card border border-navy-200 bg-white p-6 shadow-card">
        <h2 className="font-heading text-lg font-semibold text-navy-900">Date range (optional)</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="text-sm">
            <span className="font-medium text-navy-800">From</span>
            <input
              type="date"
              className="mt-1 block rounded-button border border-navy-200 px-3 py-2"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="font-medium text-navy-800">To</span>
            <input
              type="date"
              className="mt-1 block rounded-button border border-navy-200 px-3 py-2"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
        </div>
        {(!from || !to) && (
          <p className="mt-2 text-xs text-navy-500">
            Leave blank or set both dates for filtered wins / yearbook / audit.
          </p>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-navy-200 bg-navy-50 p-5">
          <h3 className="font-heading font-semibold text-navy-900">Students (CSV)</h3>
          <p className="mt-1 text-sm text-navy-600">
            Full student roster with roles and display GPA.
          </p>
          <Button
            className="mt-4"
            variant="primary"
            disabled={!!busy}
            onClick={() => void runExport("students", "students.csv")}
          >
            {busy === "students" ? "Working…" : "Download"}
          </Button>
        </div>
        <div className="rounded-card border border-navy-200 bg-navy-50 p-5">
          <h3 className="font-heading font-semibold text-navy-900">Wins (CSV)</h3>
          <p className="mt-1 text-sm text-navy-600">Filtered by date range when both dates set.</p>
          <Button
            className="mt-4"
            variant="primary"
            disabled={!!busy}
            onClick={() => void runExport("wins", "wins.csv")}
          >
            {busy === "wins" ? "Working…" : "Download"}
          </Button>
        </div>
        <div className="rounded-card border border-navy-200 bg-navy-50 p-5">
          <h3 className="font-heading font-semibold text-navy-900">Yearbook (JSON)</h3>
          <p className="mt-1 text-sm text-navy-600">
            Pages in range by `updatedAt` when dates set.
          </p>
          <Button
            className="mt-4"
            variant="primary"
            disabled={!!busy}
            onClick={() => void runExport("yearbook", "yearbook.json")}
          >
            {busy === "yearbook" ? "Working…" : "Download"}
          </Button>
        </div>
        <div className="rounded-card border border-navy-200 bg-navy-50 p-5">
          <h3 className="font-heading font-semibold text-navy-900">Audit log (CSV)</h3>
          <p className="mt-1 text-sm text-navy-600">Last 5000 rows, optional date filter.</p>
          <Button
            className="mt-4"
            variant="primary"
            disabled={!!busy}
            onClick={() => void runExport("audit", "audit.csv")}
          >
            {busy === "audit" ? "Working…" : "Download"}
          </Button>
        </div>
      </div>

      {message && <p className="text-sm text-navy-800">{message}</p>}
    </div>
  );
}
