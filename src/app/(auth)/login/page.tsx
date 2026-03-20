"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button, Input } from "@/components/ui";
import { WebPageSchema } from "@/components/seo/SchemaOrg";
import { getCanonicalUrl } from "@/lib/seo";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const isNotOnRoster = errorParam === "NotOnRoster";
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.error) {
        setError("root", { message: "Invalid email or password." });
        return;
      }
      if (res?.url) window.location.href = res.url;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setProviderLoading("google");
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <WebPageSchema name="Sign In | Largo Lions Class of 2026" url={getCanonicalUrl("/login")} />
      <div className="w-full max-w-md space-y-8 rounded-card bg-white/5 p-8 backdrop-blur sm:bg-white/10">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-white">Welcome Back, Lion 🦁</h1>
          <p className="mt-2 text-sm text-white/80">
            Sign in to track your graduation and celebrate your wins.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full bg-white text-navy-700 hover:bg-white/90"
          onClick={handleGoogleSignIn}
          disabled={!!providerLoading}
          isLoading={providerLoading === "google"}
          loadingText="Redirecting..."
        >
          Sign in with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/30" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-transparent px-4 text-white/80">or sign in with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <p className="text-sm text-danger" role="alert">
              {errors.root.message}
            </p>
          )}
          {isNotOnRoster && (
            <p className="text-sm text-warning" role="alert">
              Your email is not on the approved Class of 2026 roster. If you believe this is an error,
              contact your counselor Tomeco Dates at{" "}
              <a
                href="mailto:tomeco.dates@pgcps.org"
                className="font-medium underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
              >
                tomeco.dates@pgcps.org
              </a>{" "}
              or{" "}
              <a
                href="tel:+13018088880"
                className="font-medium underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
              >
                301-808-8880
              </a>
              .
            </p>
          )}
          {errorParam && !isNotOnRoster && (
            <p className="text-sm text-warning" role="alert">
              Something went wrong. Please try again.
            </p>
          )}
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            errorMessage={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            errorMessage={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-gold-400 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-gold-500 text-navy-900 hover:bg-gold-400"
            isLoading={loading}
            loadingText="Signing in..."
          >
            Sign in
          </Button>
        </form>

        <div
          className="rounded-lg border border-white/20 bg-white/5 p-4 text-center text-sm text-white/85"
          role="region"
          aria-label="Google sign-in accounts by audience"
        >
          <p className="font-medium text-white">Staff?</p>
          <p className="mt-1">Sign in with your @pgcps.org Google account.</p>
          <p className="mt-3 font-medium text-white">Student?</p>
          <p className="mt-1">Sign in with your @students.pgcps.org Google account.</p>
        </div>

        <p className="text-center text-sm text-white/80">
          New Lion?{" "}
          <Link
            href="/register"
            className="font-medium text-gold-400 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
          >
            Create your account
          </Link>
        </p>
      </div>
    </>
  );
}
