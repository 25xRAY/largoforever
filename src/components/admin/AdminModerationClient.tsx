"use client";

import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface WinRow {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  user: { firstName: string | null; lastName: string | null; email: string };
}

interface YearbookRow {
  id: string;
  slug: string;
  headline: string | null;
  updatedAt: string;
  user: { firstName: string | null; lastName: string | null; email: string };
}

interface CommentRow {
  id: string;
  content: string;
  relation: string;
  createdAt: string;
  user: { firstName: string | null; lastName: string | null; email: string };
}

interface ModerationPayload {
  wins: WinRow[];
  yearbooks: YearbookRow[];
  comments: CommentRow[];
}

async function fetchModeration(): Promise<ModerationPayload> {
  const res = await fetch("/api/admin/moderation?type=all");
  if (!res.ok) throw new Error("Failed to load queues");
  return res.json();
}

async function postModeration(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/moderation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error((j as { error?: string }).error ?? "Action failed");
  }
}

function person(u: { firstName: string | null; lastName: string | null; email: string }) {
  const n = [u.firstName, u.lastName].filter(Boolean).join(" ");
  return n || u.email;
}

/**
 * Four moderation tabs: wins, yearbook, comments, and reported placeholder.
 */
export function AdminModerationClient() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-moderation"],
    queryFn: fetchModeration,
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [selectedWins, setSelectedWins] = useState<Set<string>>(() => new Set());
  const [previewYb, setPreviewYb] = useState<YearbookRow | null>(null);

  const invalidate = useCallback(() => {
    void qc.invalidateQueries({ queryKey: ["admin-moderation"] });
    void qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }, [qc]);

  const act = useCallback(
    async (payload: Record<string, unknown>, key: string) => {
      setBusy(key);
      try {
        await postModeration(payload);
        invalidate();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Request failed");
      } finally {
        setBusy(null);
      }
    },
    [invalidate]
  );

  const note = (id: string) => notesById[id]?.trim() ?? "";

  const bulkApproveWins = useCallback(async () => {
    const ids = Array.from(selectedWins);
    if (ids.length === 0) return;
    setBusy("bulk-wins");
    try {
      for (const id of ids) {
        const n = notesById[id]?.trim() ?? "";
        await postModeration({ action: "approve", type: "win", id, notes: n || undefined });
      }
      setSelectedWins(new Set());
      invalidate();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Bulk approve failed");
    } finally {
      setBusy(null);
    }
  }, [selectedWins, notesById, invalidate]);

  const toggleWin = useCallback((id: string) => {
    setSelectedWins((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllWins = useCallback(() => {
    if (!data?.wins.length) return;
    setSelectedWins((prev) => {
      if (prev.size === data.wins.length) return new Set();
      return new Set(data.wins.map((w) => w.id));
    });
  }, [data?.wins]);

  if (isLoading)
    return <div className="h-64 animate-pulse rounded-card bg-navy-100" aria-busy="true" />;
  if (error || !data) return <p className="text-danger-dark">Could not load moderation queues.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">Moderation</h1>
        <p className="mt-1 text-sm text-navy-600">
          Approve or reject wins, yearbook pages, and comments. Reject requires a note.
        </p>
      </div>

      <Tabs.Root defaultValue="wins" className="space-y-4">
        <Tabs.List
          className="flex flex-wrap gap-2 border-b border-navy-200 pb-2"
          aria-label="Moderation views"
        >
          {(
            [
              ["wins", `Pending wins (${data.wins.length})`],
              ["yearbook", `Pending yearbook (${data.yearbooks.length})`],
              ["comments", `Comments (${data.comments.length})`],
              ["reported", "Reported content"],
            ] as const
          ).map(([v, label]) => (
            <Tabs.Trigger
              key={v}
              value={v}
              className={cn(
                "rounded-button px-3 py-1.5 text-sm font-medium",
                "data-[state=active]:bg-navy-500 data-[state=active]:text-white",
                "data-[state=inactive]:bg-navy-100 text-navy-800 data-[state=inactive]:hover:bg-navy-200",
                "focus:outline-none focus:ring-2 focus:ring-gold-500"
              )}
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="wins" className="outline-none">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => toggleAllWins()}>
              Toggle all
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={selectedWins.size === 0 || busy === "bulk-wins"}
              onClick={() => void bulkApproveWins()}
            >
              Approve selected ({selectedWins.size})
            </Button>
          </div>
          <div className="overflow-x-auto rounded-card border border-navy-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-navy-50">
                <tr>
                  <th className="px-3 py-2 w-10" scope="col">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Title</th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Type</th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Student</th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Notes</th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.wins.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-navy-600">
                      No pending wins.
                    </td>
                  </tr>
                ) : (
                  data.wins.map((w) => (
                    <tr key={w.id} className="border-t border-navy-100">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedWins.has(w.id)}
                          onChange={() => toggleWin(w.id)}
                          aria-label={`Select win ${w.title}`}
                        />
                      </td>
                      <td className="px-3 py-2 font-medium text-navy-900">{w.title}</td>
                      <td className="px-3 py-2 text-navy-700">{w.type}</td>
                      <td className="px-3 py-2 text-navy-700">{person(w.user)}</td>
                      <td className="px-3 py-2 max-w-xs">
                        <input
                          className="w-full rounded border border-navy-200 px-2 py-1 text-xs"
                          placeholder="Optional note"
                          value={notesById[w.id] ?? ""}
                          onChange={(e) => setNotesById((m) => ({ ...m, [w.id]: e.target.value }))}
                        />
                      </td>
                      <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={busy === w.id}
                          onClick={() =>
                            void act({ action: "approve", type: "win", id: w.id }, w.id)
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={busy === `${w.id}-rej`}
                          onClick={() => {
                            const n = note(w.id);
                            if (!n) {
                              alert("Add a note to reject.");
                              return;
                            }
                            void act(
                              { action: "reject", type: "win", id: w.id, notes: n },
                              `${w.id}-rej`
                            );
                          }}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        <Tabs.Content value="yearbook" className="outline-none">
          <div className="overflow-x-auto rounded-card border border-navy-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-navy-50">
                <tr>
                  <th className="px-3 py-2 font-semibold text-navy-900">Headline</th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Slug</th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Student</th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.yearbooks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-navy-600">
                      No pending yearbook pages.
                    </td>
                  </tr>
                ) : (
                  data.yearbooks.map((y) => (
                    <tr key={y.id} className="border-t border-navy-100">
                      <td className="px-3 py-2 font-medium text-navy-900">{y.headline ?? "—"}</td>
                      <td className="px-3 py-2 text-navy-700">{y.slug}</td>
                      <td className="px-3 py-2 text-navy-700">{person(y.user)}</td>
                      <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setPreviewYb(y)}
                        >
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={busy === y.id}
                          onClick={() =>
                            void act({ action: "approve", type: "yearbook", id: y.id }, y.id)
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={busy === `${y.id}-rej`}
                          onClick={() => {
                            const n = prompt("Rejection note (required):");
                            if (!n?.trim()) return;
                            void act(
                              { action: "reject", type: "yearbook", id: y.id, notes: n.trim() },
                              `${y.id}-rej`
                            );
                          }}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Dialog.Root open={!!previewYb} onOpenChange={(o) => !o && setPreviewYb(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card border border-navy-200 bg-white p-6 shadow-xl focus:outline-none">
                <Dialog.Title className="font-heading text-lg font-bold text-navy-900">
                  Yearbook preview
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-navy-600">
                  {previewYb ? `${person(previewYb.user)} · /yearbook/${previewYb.slug}` : ""}
                </Dialog.Description>
                {previewYb && (
                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <strong>Headline:</strong> {previewYb.headline ?? "—"}
                    </p>
                    <p>
                      <strong>Slug:</strong> {previewYb.slug}
                    </p>
                    <a
                      href={`/yearbook/${previewYb.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-navy-600 underline"
                    >
                      Open public page
                    </a>
                  </div>
                )}
                <Dialog.Close asChild>
                  <Button className="mt-6" variant="secondary" type="button">
                    Close
                  </Button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </Tabs.Content>

        <Tabs.Content value="comments" className="outline-none">
          <div className="overflow-x-auto rounded-card border border-navy-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-navy-50">
                <tr>
                  <th className="px-3 py-2 font-semibold text-navy-900">Content</th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Relation</th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Author</th>
                  <th className="px-3 py-2 font-semibold text-navy-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.comments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-navy-600">
                      No pending comments.
                    </td>
                  </tr>
                ) : (
                  data.comments.map((c) => (
                    <tr key={c.id} className="border-t border-navy-100">
                      <td className="px-3 py-2 max-w-md text-navy-800">{c.content}</td>
                      <td className="px-3 py-2 text-navy-700">{c.relation}</td>
                      <td className="px-3 py-2 text-navy-700">{person(c.user)}</td>
                      <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={busy === c.id}
                          onClick={() =>
                            void act({ action: "approve", type: "comment", id: c.id }, c.id)
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={busy === `${c.id}-rej`}
                          onClick={() => {
                            const n = prompt("Rejection note (required):");
                            if (!n?.trim()) return;
                            void act(
                              { action: "reject", type: "comment", id: c.id, notes: n.trim() },
                              `${c.id}-rej`
                            );
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === `${c.id}-flag`}
                          onClick={() =>
                            void act({ action: "flag", type: "comment", id: c.id }, `${c.id}-flag`)
                          }
                        >
                          Flag
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        <Tabs.Content value="reported" className="outline-none">
          <div className="rounded-card border border-navy-200 bg-navy-50 p-8 text-center text-navy-700">
            <p className="font-medium text-navy-900">No separate reported-content queue</p>
            <p className="mt-2 text-sm">
              Use <strong>Flag</strong> on comments and rejection flows for wins and yearbook. A
              dedicated reported feed can be added when the backend exposes it.
            </p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
