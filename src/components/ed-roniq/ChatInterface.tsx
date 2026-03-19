"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EdRoniqCrisisBanner } from "./EdRoniqCrisisBanner";
import { ChatMessage, type ChatBubble } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
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
 * Full-page Ed RonIQ chat: messages, suggestions sidebar, crisis strip.
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

  const scrollToEnd = () => endRef.current?.scrollIntoView({ behavior: "smooth" });

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
    [loading]
  );

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col gap-4 lg:flex-row">
      <aside className="lg:w-64 shrink-0 space-y-2 rounded-card border border-navy-200 bg-white p-4 shadow-card">
        <p className="text-xs font-semibold uppercase text-navy-500">Quick prompts</p>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => void send(s)}
            disabled={loading}
            className={cn(
              "w-full rounded-button border border-navy-200 px-3 py-2 text-left text-sm text-navy-800",
              "hover:border-gold-500 hover:bg-gold-50 focus:outline-none focus:ring-2 focus:ring-gold-500",
              "disabled:opacity-50"
            )}
          >
            {s}
          </button>
        ))}
      </aside>

      <div className="flex min-h-[480px] flex-1 flex-col rounded-card border border-navy-200 bg-white shadow-card">
        <div className="border-b border-navy-100 p-4">
          <EdRoniqCrisisBanner active={crisisActive} />
          <p className="mt-2 text-xs text-navy-600">
            <strong>Disclaimer:</strong> Ed RonIQ gives general graduation information, not personal
            counseling. For mental health or safety concerns, use the crisis resources above or
            contact your counselor.
          </p>
        </div>
        <div
          className="flex-1 space-y-4 overflow-y-auto p-4"
          style={{ maxHeight: "min(60vh, 520px)" }}
        >
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={endRef} />
        </div>
        <form
          className="flex gap-2 border-t border-navy-100 p-4"
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
            className="flex-1 rounded-button border-2 border-navy-200 px-4 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            maxLength={8000}
            disabled={loading}
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !input.trim()}
            className="bg-gold-500 text-navy-900"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
