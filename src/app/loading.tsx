import { Logo } from "@/components/layout/Logo";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-500">
      <Logo className="h-24 w-24 animate-pulse text-gold-500" aria-hidden />
      <p className="mt-4 text-sm text-white/80" aria-live="polite">
        Loading...
      </p>
    </div>
  );
}
