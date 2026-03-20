"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EdRoniqCrisisBanner } from "@/components/ed-roniq/EdRoniqCrisisBanner";
import { ChatMessage, type ChatBubble } from "@/components/ed-roniq/ChatMessage";
import { TypingIndicator } from "@/components/ed-roniq/TypingIndicator";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What assessments do I still need?",
  "How do I log service hours?",
  "FAFSA deadlines reminder",
  "Explain CCR for my pathway",
];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Full-viewport-height Ed RonIQ chat: scrollable messages, quick prompts above input, composer pinned to bottom.
 */
export function ChatInterface() {
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: uid(),
      role: "assistant",
      content:
        "Hey Lion! 🦁 I’m Ed RonIQ. Ask me about graduation credits, assessments, service hours, FAFSA, or pathways — I’m not a counselor, but I can point you to official requirements.",
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisisActive, setCrisisActive] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatBubble[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /** Keep the thread pinned to the latest bubble whenever content or typing state changes. */
  useEffect(() => {
    scrollToEnd();
  }, [messages, loading, scrollToEnd]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatBubble = {
        id: uid(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);
      setCrisisActive(false);
      scrollToEnd();

      const prior = messagesRef.current;
      const historyWithLatest = [...prior, userMsg].slice(-20);
      const conversationHistory = historyWithLatest.slice(0, -1).map((x) => ({
        role: x.role,
        content: x.content,
      }));

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, conversationHistory }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMessages((m) => [
            ...m,
            {
              id: uid(),
              role: "assistant",
              content:
                (data.error as string) ||
                "I couldn’t reach the assistant right now. Try again or talk with your counselor.",
              createdAt: Date.now(),
            },
          ]);
          return;
        }
        if (data.crisisDetected) setCrisisActive(true);
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: "assistant",
            content: String(data.reply ?? ""),
            createdAt: Date.now(),
          },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          {
            id: uid(),
            role: "assistant",
            content: "Something went wrong. Please try again.",
            createdAt: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
        scrollToEnd();
      }
    },
    [loading, scrollToEnd]
  );

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border border-navy-200 bg-white shadow-card",
        "max-lg:min-h-0"
      )}
    >
      <div className="shrink-0 border-b border-navy-100 p-3 sm:p-4">
        <EdRoniqCrisisBanner active={crisisActive} />
        <p className="mt-2 text-xs text-navy-600">
          <strong>Disclaimer:</strong> Ed RonIQ gives general graduation information, not personal
          counseling. For mental health or safety concerns, use the crisis resources above or
          contact your counselor.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
        <div className="space-y-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={endRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-navy-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4">
        <div className="mb-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-500">
            Quick prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void send(s)}
                disabled={loading}
                className={cn(
                  "rounded-full border border-navy-200 bg-navy-50 px-3 py-1.5 text-left text-xs text-navy-800 sm:text-sm",
                  "hover:border-gold-500 hover:bg-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-500",
                  "disabled:opacity-50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <label htmlFor="ed-roniq-input" className="sr-only">
            Message to Ed RonIQ
          </label>
          <input
            id="ed-roniq-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about graduation, FAFSA, or pathways..."
            className="min-w-0 flex-1 rounded-button border-2 border-navy-200 px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            maxLength={8000}
            disabled={loading}
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !input.trim()}
            className="shrink-0 bg-gold-500 text-navy-900"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
