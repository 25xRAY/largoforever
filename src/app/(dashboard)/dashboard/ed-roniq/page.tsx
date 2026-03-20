import type { Metadata } from "next";
import { ChatInterface } from "@/components/ai/ChatInterface";

export const metadata: Metadata = {
  title: "Ed RonIQ",
  robots: { index: false, follow: false },
};

/**
 * Ed RonIQ: full-viewport-height chat shell (header 4rem + breadcrumbs + title offset; `100dvh` on mobile).
 */
export default function EdRoniqPage() {
  return (
    <div className="flex min-h-0 flex-col gap-3 md:gap-4 h-[calc(100dvh-7.5rem)] sm:h-[calc(100dvh-8.5rem)] lg:h-[calc(100vh-11.5rem)]">
      <header className="shrink-0">
        <h1 className="font-heading text-xl font-bold text-navy-900 sm:text-2xl">Ed RonIQ 🦁</h1>
        <p className="mt-0.5 text-xs text-navy-600 sm:mt-1 sm:text-sm">
          Your graduation assistant — credits, tests, hours, and next steps.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <ChatInterface />
      </div>
    </div>
  );
}
