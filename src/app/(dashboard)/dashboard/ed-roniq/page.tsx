import type { Metadata } from "next";
import { ChatInterface } from "@/components/ed-roniq/ChatInterface";

export const metadata: Metadata = {
  title: "Ed RonIQ",
  robots: { index: false, follow: false },
};

export default function EdRoniqPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy-900">Ed RonIQ 🦁</h1>
      <p className="mt-1 text-sm text-navy-600">
        Your graduation assistant — answers about credits, tests, hours, and next steps.
      </p>
      <div className="mt-6">
        <ChatInterface />
      </div>
    </div>
  );
}
