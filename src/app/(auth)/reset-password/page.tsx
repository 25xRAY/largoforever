"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WebPageSchema } from "@/components/seo/SchemaOrg";
import { getCanonicalUrl } from "@/lib/seo";

type Stage = "form" | "done" | "error";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const emailParam = searchParams.get("email") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<Stage>("form");

  useEffect(() => {
    if (!token || !emailParam) {
      setStage("error");
    }
  }, [token, emailParam]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (newPassword.length < 8) errs.newPassword = "Must be at least 8 characters.";
    if (!/[A-Z]/.test(newPassword)) errs.newPassword = "Must include an uppercase letter.";
    if (!/[0-9]/.test(newPassword)) errs.newPassword = "Must include a number.";
    if (newPassword !== confirm) errs.confirm = "Passwords do not match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailParam.trim().toLowerCase(),
          token,
          newPassword,
        }),
      });
      const data: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data === "object" && data !== null && "error" in data
            ? String((data as { error: unknown }).error)
            : "Reset failed.";
        setErrors({ root: msg });
        return;
      }
      setStage("done");
    } catch {
      setErrors({ root: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  }

  if (stage === "done") {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-heading text-2xl font-bold text-white">Password updated</h1>
        <p className="text-sm text-white/80">You can sign in with your new password.</p>
        <Link
          href="/login"
          className="inline-block text-sm font-medium text-gold-400 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  if (stage === "error" && (!token || !emailParam)) {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-heading text-2xl font-bold text-white">Invalid link</h1>
        <p className="text-sm text-white/80">
          This reset link is missing a token or email. Open the link from your email or request a
          new reset.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block text-sm font-medium text-gold-400 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
        >
          Forgot password
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.root && (
        <p className="text-sm text-white font-medium" role="alert">
          {errors.root}
        </p>
      )}
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        errorMessage={errors.newPassword}
        className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
        aria-label="New password"
      />
      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        errorMessage={errors.confirm}
        className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
        aria-label="Confirm new password"
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full bg-gold-500 text-navy-900 hover:bg-gold-400"
        isLoading={loading}
        loadingText="Saving…"
        aria-label="Save new password"
      >
        Save new password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <WebPageSchema
        name="Reset Password | Largo Lions Class of 2026"
        url={getCanonicalUrl("/reset-password")}
      />
      <div className="w-full max-w-md space-y-8 rounded-card bg-white/5 p-8 backdrop-blur sm:bg-white/10">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-white">Reset password</h1>
          <p className="mt-2 text-sm text-white/80">Choose a new password for your account.</p>
        </div>
        <Suspense
          fallback={
            <p className="text-center text-sm text-white/70" role="status">
              Loading…
            </p>
          }
        >
          <ResetPasswordForm />
        </Suspense>
        <p className="text-center text-sm text-white/80">
          <Link
            href="/login"
            className="font-medium text-gold-400 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
