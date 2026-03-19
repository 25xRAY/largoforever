"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Button, Input } from "@/components/ui";

function getPasswordStrength(password: string): "weak" | "fair" | "strong" | "excellent" {
  if (!password) return "weak";
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return "weak";
  if (score <= 3) return "fair";
  if (score <= 4) return "strong";
  return "excellent";
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = watch("password", "");
  const strength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setError("email", { message: "An account with this email already exists." });
        } else {
          setError("root", { message: json.error ?? "Registration failed." });
        }
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("root", { message: "Account created but sign-in failed. Please sign in." });
        router.push("/login");
        return;
      }
      router.push("/onboarding");
    } catch {
      setError("root", { message: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setProviderLoading(true);
    signIn("google", { callbackUrl: "/onboarding" });
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-card bg-white/5 p-8 backdrop-blur sm:bg-white/10">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold text-white">
          Join the Pride 🦁
        </h1>
        <p className="mt-2 text-sm text-white/80">
          Create your account to track graduation and celebrate wins.
        </p>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full bg-white text-navy-700 hover:bg-white/90"
        onClick={handleGoogleSignUp}
        disabled={providerLoading}
        isLoading={providerLoading}
        loadingText="Redirecting..."
      >
        Sign up with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/30" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-transparent px-4 text-white/80">or register with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit as (data: RegisterInput) => void)} className="space-y-4">
        {errors.root && (
          <p className="text-sm text-danger" role="alert">
            {errors.root.message}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            autoComplete="given-name"
            errorMessage={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            label="Last name"
            autoComplete="family-name"
            errorMessage={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <div>
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            errorMessage={errors.password?.message}
            {...register("password")}
          />
          <p className="mt-1 text-xs text-white/70">
            Strength:{" "}
            <span
              className={
                strength === "weak"
                  ? "text-danger"
                  : strength === "fair"
                    ? "text-warning"
                    : strength === "strong"
                      ? "text-gold-500"
                      : "text-success"
              }
            >
              {strength}
            </span>
          </p>
        </div>
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          errorMessage={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            {...register("acceptTerms")}
            className="mt-1 rounded border-navy-300 text-gold-500 focus:ring-gold-500"
          />
          <span className="text-sm text-white/90">
            I accept the{" "}
            <Link href="/terms" className="text-gold-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gold-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-sm text-danger">{errors.acceptTerms.message}</p>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-gold-500 text-navy-900 hover:bg-gold-400"
          isLoading={loading}
          loadingText="Creating account..."
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-white/80">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-gold-400 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
