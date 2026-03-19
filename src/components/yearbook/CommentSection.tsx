"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema, type CommentInput } from "@/lib/validations/yearbook";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
}

interface CommentSectionProps {
  slug: string;
  comments: Comment[];
  onCommentSubmitted?: () => void;
}

/**
 * Comment form (name, relationship, message 500 chars). List of approved comments. Auth required to post.
 */
export function CommentSection({ slug, comments: initialComments, onCommentSubmitted }: CommentSectionProps) {
  const { status } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { authorName: "", authorRelationship: "CLASSMATE", message: "" },
  });

  const onSubmit = async (data: CommentInput) => {
    setIsSubmitting(true);
    const res = await fetch(`/api/yearbook/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setIsSubmitting(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      form.setError("root", { message: err.error ?? "Failed to post" });
      return;
    }
    form.reset();
    toast.toast({ title: "Comment submitted. It will appear after moderation.", variant: "success" });
    const listRes = await fetch(`/api/yearbook/${slug}/comments`);
    if (listRes.ok) {
      const json = await listRes.json();
      setComments(json.data ?? []);
    }
    onCommentSubmitted?.();
  };

  return (
    <section className="mt-12 border-t border-navy-200 pt-8">
      <h2 className="font-heading text-xl font-semibold text-navy-900">Comments</h2>
      {status === "authenticated" ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <Input label="Your name" {...form.register("authorName")} errorMessage={form.formState.errors.authorName?.message} />
          <div>
            <label className="mb-1 block text-sm font-medium text-navy-700">Relationship</label>
            <select
              className="w-full rounded-button border-2 border-navy-200 px-4 py-3 font-body text-navy-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
              {...form.register("authorRelationship")}
            >
              <option value="FRIEND">Friend</option>
              <option value="FAMILY">Family</option>
              <option value="TEACHER">Teacher</option>
              <option value="CLASSMATE">Classmate</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-navy-700">Message (max 500 characters)</label>
            <textarea
              {...form.register("message")}
              maxLength={500}
              rows={3}
              className={cn(
                "w-full rounded-button border-2 border-navy-200 bg-white px-4 py-3 font-body text-navy-900",
                "focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500",
                form.formState.errors.message && "border-danger focus:border-danger focus:ring-danger"
              )}
            />
            <p className="mt-1 text-right text-sm text-navy-500">
              {(form.watch("message") ?? "").length}/500
            </p>
            {form.formState.errors.message && (
              <p className="mt-1 text-sm text-danger">{form.formState.errors.message.message}</p>
            )}
          </div>
          {form.formState.errors.root && (
            <p className="text-danger text-sm">{form.formState.errors.root.message}</p>
          )}
          <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
            {isSubmitting ? "Posting…" : "Post comment"}
          </Button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-navy-600">Sign in to leave a comment.</p>
      )}
      <ul className="mt-8 space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="rounded-card border border-navy-200 bg-navy-50/50 p-4">
            <p className="font-medium text-navy-900">{c.authorName}</p>
            <p className="mt-1 text-sm text-navy-700">{c.content}</p>
            <p className="mt-2 text-xs text-navy-500">{new Date(c.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
