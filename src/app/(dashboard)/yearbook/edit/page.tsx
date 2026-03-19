"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { YearbookEditor } from "@/components/yearbook";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useState } from "react";

async function fetchMyYearbook() {
  const res = await fetch("/api/yearbook/me");
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

export default function YearbookEditPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [createDisplayName, setCreateDisplayName] = useState("");

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["yearbook-me"],
    queryFn: fetchMyYearbook,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/yearbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: createDisplayName || undefined }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Create failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["yearbook-me"] });
      toast.toast({ title: "Yearbook page created.", variant: "success" });
    },
    onError: (err: Error) => {
      toast.toast({ title: err.message, variant: "error" });
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-navy-600">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-danger">Something went wrong. Try again later.</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <h1 className="font-heading text-2xl font-bold text-navy-900">Create your yearbook page</h1>
        <p className="text-navy-600">Add your display name to get started. You can edit everything else after.</p>
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Display name (optional)"
            value={createDisplayName}
            onChange={(e) => setCreateDisplayName(e.target.value)}
            className="min-w-[200px]"
          />
          <Button
            variant="primary"
            size="md"
            disabled={createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? "Creating…" : "Create yearbook page"}
          </Button>
        </div>
        <Link href="/dashboard" className="text-gold-600 hover:underline text-sm">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const slug = page.slug ?? "";
  const initialData = {
    displayName: page.displayName ?? undefined,
    headline: page.headline ?? undefined,
    tagline: page.tagline ?? undefined,
    quote: page.quote ?? undefined,
    myStory: page.myStory ?? undefined,
    favoriteQuote: page.favoriteQuote ?? undefined,
    favoriteMemories: page.favoriteMemories ?? [],
    galleryPhotos: page.galleryPhotos ?? [],
    template: page.template ?? "CLASSIC",
    imageUrl: page.imageUrl ?? undefined,
    accentColor: page.accentColor ?? undefined,
    cashappHandle: page.cashappHandle ?? undefined,
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-navy-900">Edit your yearbook page</h1>
        <Link href="/dashboard" className="text-gold-600 hover:underline text-sm">
          ← Dashboard
        </Link>
      </div>
      <YearbookEditor slug={slug} initialData={initialData} />
      {slug && (
        <p className="text-sm text-navy-600">
          Your page: <a href={`/yearbook/${slug}`} className="text-gold-600 hover:underline" target="_blank" rel="noopener noreferrer">/yearbook/{slug}</a>
        </p>
      )}
    </div>
  );
}
