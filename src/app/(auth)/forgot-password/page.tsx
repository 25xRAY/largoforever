"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WebPageSchema } from "@/components/seo/SchemaOrg";
import { getCanonicalUrl } from "@/lib/seo";

type Stage = "form" | "sent" | "error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setStage("sent");
    } catch {
      setStage("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <WebPageSchema
        name="Forgot Password | Largo Lions Class of 2026"
        url={getCanonicalUrl("/forgot-password")}
      />
      <div className="w-full max-w-md space-y-8 rounded-card bg-white/5 p-8 backdrop-blur sm:bg-white/10">
        {stage === "sent" ? (
          <div className="text-center space-y-4">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/20"
              aria-hidden
            >
              <svg
                className="h-8 w-8 text-gold-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="font-heading text-2xl font-bold text-white">Check your email</h1>
            <p className="text-sm text-white/80">
              If <strong className="text-white">{email}</strong> is in our system, you&apos;ll
              receive a password reset link within a few minutes.
            </p>
            <p className="text-xs text-white/60">
              Don&apos;t see it? Check your spam folder or contact your counselor. In local
              development, check the server log for the reset link.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 text-sm font-medium text-gold-400 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              ← Back to Sign In
            </Link>
          </div>
        ) : stage === "error" ? (
          <div className="text-center space-y-4">
            <h1 className="font-heading text-2xl font-bold text-white">Something went wrong</h1>
            <p className="text-sm text-white/80">
              We couldn&apos;t process your request. Please try again or contact your counselor.
            </p>
            <Button
              type="button"
              variant="primary"
              className="bg-gold-500 text-navy-900 hover:bg-gold-400"
              onClick={() => setStage("form")}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold text-white">Forgot Password?</h1>
              <p className="mt-2 text-sm text-white/80">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                errorMessage={emailError}
                className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                placeholder="you@students.pgcps.org"
                aria-label="Email address"
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-gold-500 text-navy-900 hover:bg-gold-400"
                isLoading={loading}
                loadingText="Sending…"
                aria-label="Send password reset link"
              >
                Send Reset Link
              </Button>
            </form>

            <p className="text-center text-sm text-white/80">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-gold-400 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
              >
                Back to Sign In
              </Link>
            </p>

            <div className="rounded-lg border border-white/20 bg-white/5 p-4 text-center text-xs text-white/70">
              <p>
                Don&apos;t have access to your email? Contact your counselor at{" "}
                <a
                  href="mailto:tomeco.dates@pgcps.org"
                  className="text-gold-400 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                >
                  tomeco.dates@pgcps.org
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
