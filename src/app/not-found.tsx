import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-500 px-4">
      <Logo className="h-20 w-20 text-gold-500" />
      <h1 className="mt-8 font-heading text-3xl font-bold text-white sm:text-4xl">
        Lost Lion? 🦁
      </h1>
      <p className="mt-4 max-w-md text-center text-white/90">
        This page doesn&apos;t exist. Let&apos;s get you back to the pride.
      </p>
      <Button asChild variant="primary" size="lg" className="mt-8 bg-gold-500 text-navy-900 hover:bg-gold-400">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
