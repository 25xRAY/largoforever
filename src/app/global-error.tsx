"use client";

/**
 * Root error UI when the root layout fails. Must define its own <html> and <body> (Next.js App Router).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-navy-500 px-4 py-12 font-sans text-white">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-white/90">{error.message}</p>
        <button
          type="button"
          className="mt-6 rounded-button bg-gold-500 px-4 py-2 font-semibold text-navy-900"
          onClick={() => reset()}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
