"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to reporting service in production
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-500 px-4">
      <Logo className="h-20 w-20 text-gold-500" />
      <h1 className="mt-8 font-heading text-3xl font-bold text-white sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-center text-white/90">
        We couldn&apos;t load this page. Please try again or head back home.
      </p>
      <div className="mt-8 flex gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={reset}
          className="bg-gold-500 text-navy-900 hover:bg-gold-400"
        >
          Try again
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-white text-white hover:bg-white/10"
        >
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
