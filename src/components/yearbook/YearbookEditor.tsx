"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { yearbookPageSchema, type YearbookPageInput } from "@/lib/validations/yearbook";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface YearbookEditorProps {
  slug: string;
  initialData: Partial<YearbookPageInput> & { favoriteMemories?: string[]; galleryPhotos?: string[] };
}

/**
 * Edit yearbook page: template, text fields, memories list, gallery URLs, color. Save → PATCH.
 */
export function YearbookEditor({ slug, initialData }: YearbookEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const form = useForm<YearbookPageInput>({
    resolver: zodResolver(yearbookPageSchema),
    defaultValues: {
      displayName: initialData.displayName ?? "",
      headline: initialData.headline ?? "",
      tagline: initialData.tagline ?? "",
      quote: initialData.quote ?? "",
      myStory: initialData.myStory ?? "",
      favoriteQuote: initialData.favoriteQuote ?? "",
      favoriteMemories: initialData.favoriteMemories ?? [],
      galleryPhotos: initialData.galleryPhotos ?? [],
      template: initialData.template ?? "CLASSIC",
      imageUrl: initialData.imageUrl ?? "",
      accentColor: initialData.accentColor ?? "",
      cashappHandle: initialData.cashappHandle ?? "",
    },
  });

  const memories = form.watch("favoriteMemories") ?? [];
  const gallery = form.watch("galleryPhotos") ?? [];

  useEffect(() => {
    form.reset({
      displayName: initialData.displayName ?? "",
      headline: initialData.headline ?? "",
      tagline: initialData.tagline ?? "",
      quote: initialData.quote ?? "",
      myStory: initialData.myStory ?? "",
      favoriteQuote: initialData.favoriteQuote ?? "",
      favoriteMemories: initialData.favoriteMemories ?? [],
      galleryPhotos: initialData.galleryPhotos ?? [],
      template: initialData.template ?? "CLASSIC",
      imageUrl: initialData.imageUrl ?? "",
      accentColor: initialData.accentColor ?? "",
      cashappHandle: initialData.cashappHandle ?? "",
    });
  }, [initialData, form]);

  const onSave = form.handleSubmit(async (data) => {
    const memories = (data.favoriteMemories ?? []).filter(Boolean);
    const photos = (data.galleryPhotos ?? []).filter((u): u is string => Boolean(u && u.startsWith("http")));
    setIsSaving(true);
    const res = await fetch(`/api/yearbook/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        favoriteMemories: memories,
        galleryPhotos: photos,
      }),
    });
    setIsSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.toast({ title: err.error ?? "Save failed", variant: "error" });
      return;
    }
    toast.toast({ title: "Yearbook page saved.", variant: "success" });
  });

  return (
    <form onSubmit={onSave} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Display name" {...form.register("displayName")} errorMessage={form.formState.errors.displayName?.message} />
        <Input label="Headline" {...form.register("headline")} errorMessage={form.formState.errors.headline?.message} />
        <Input label="Tagline" {...form.register("tagline")} errorMessage={form.formState.errors.tagline?.message} className="sm:col-span-2" />
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-navy-700">Template</label>
          <select
            className="w-full rounded-button border-2 border-navy-200 px-4 py-3 font-body text-navy-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            {...form.register("template")}
          >
            <option value="CLASSIC">Classic</option>
            <option value="MODERN">Modern</option>
            <option value="MINIMAL">Minimal</option>
            <option value="BOLD">Bold</option>
            <option value="SCRAPBOOK">Scrapbook</option>
          </select>
        </div>
        <Input label="Profile image URL" {...form.register("imageUrl")} errorMessage={form.formState.errors.imageUrl?.message} className="sm:col-span-2" />
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-navy-700">Quote</label>
          <textarea
            {...form.register("quote")}
            rows={2}
            className={cn(
              "w-full rounded-button border-2 border-navy-200 bg-white px-4 py-3 font-body text-navy-900",
              "focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            )}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-navy-700">My story (max 1500 chars)</label>
          <textarea
            {...form.register("myStory")}
            maxLength={1500}
            rows={5}
            className={cn(
              "w-full rounded-button border-2 border-navy-200 bg-white px-4 py-3 font-body text-navy-900",
              "focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            )}
          />
          <p className="mt-1 text-right text-sm text-navy-500">{(form.watch("myStory") ?? "").length}/1500</p>
        </div>
        <Input label="Favorite quote" {...form.register("favoriteQuote")} errorMessage={form.formState.errors.favoriteQuote?.message} className="sm:col-span-2" />
      </div>

      <div>
        <h3 className="font-heading text-lg font-semibold text-navy-900">Favorite memories (up to 10)</h3>
        {memories.map((_, i) => (
          <div key={i} className="mt-2 flex gap-2">
            <input
              className="flex-1 rounded-button border-2 border-navy-200 px-4 py-2 font-body text-navy-900"
              value={memories[i] ?? ""}
              onChange={(e) => {
                const next = [...memories];
                next[i] = e.target.value;
                form.setValue("favoriteMemories", next);
              }}
              maxLength={200}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => form.setValue("favoriteMemories", memories.filter((_, j) => j !== i))}
            >
              Remove
            </Button>
          </div>
        ))}
        {memories.length < 10 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => form.setValue("favoriteMemories", [...memories, ""])}
          >
            Add memory
          </Button>
        )}
      </div>

      <div>
        <h3 className="font-heading text-lg font-semibold text-navy-900">Gallery photos (up to 6 URLs)</h3>
        {gallery.map((_, i) => (
          <div key={i} className="mt-2 flex gap-2">
            <input
              className="flex-1 rounded-button border-2 border-navy-200 px-4 py-2 font-body text-navy-900"
              type="url"
              placeholder="https://…"
              value={gallery[i] ?? ""}
              onChange={(e) => {
                const next = [...gallery];
                next[i] = e.target.value;
                form.setValue("galleryPhotos", next);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => form.setValue("galleryPhotos", gallery.filter((_, j) => j !== i))}
            >
              Remove
            </Button>
          </div>
        ))}
        {gallery.length < 6 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => form.setValue("galleryPhotos", [...gallery, ""])}
          >
            Add photo URL
          </Button>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" size="md" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
        <Button type="button" variant="secondary" size="md" asChild>
          <a href={slug ? `/yearbook/${slug}` : "/yearbook"}>Preview</a>
        </Button>
      </div>
    </form>
  );
}
