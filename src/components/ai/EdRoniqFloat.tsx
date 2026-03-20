"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
};

const GREETING =
  "Hey Lion! 🦁 I'm Ed RonIQ — your graduation assistant. Ask me about credits, service hours, assessments, career pathways, or anything else. What's on your mind?";

const QUICK_PROMPTS = [
  "How many credits do I need?",
  "What are my service hours?",
  "When is graduation?",
  "What's the CCR pathway?",
];

const EXCLUDED_PATHS = [
  "/dashboard/ed-roniq",
  "/admin",
  "/login",
  "/register",
  "/onboarding",
  "/forgot-password",
  "/reset-password",
];

const MAX_HISTORY = 40;

export function EdRoniqFloat() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "assistant", content: GREETING, ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pulsing, setPulsing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setPulsing(false), 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setUnread(0);
    }
  }, [open]);

  const isExcluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));
  if (isExcluded) return null;

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    if (!session?.user) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Please sign in to chat with Ed RonIQ about your graduation.",
          ts: Date.now(),
        },
      ]);
      setInput("");
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      ts: Date.now(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    const thread = [...messages, userMsg];
    const conversationHistory = thread
      .slice(0, -1)
      .map((m) => ({ role: m.role, content: m.content }))
      .slice(-MAX_HISTORY);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          conversationHistory,
        }),
      });

      const data: { reply?: string; error?: string } = await res.json().catch(() => ({}));

      if (res.status === 401) {
        setMessages((m) => [
          ...m,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Please sign in to use Ed RonIQ.",
            ts: Date.now(),
          },
        ]);
        return;
      }

      if (res.status === 403) {
        setMessages((m) => [
          ...m,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "Ed RonIQ chat is available to students and authorized staff. Contact your counselor for personal graduation questions.",
            ts: Date.now(),
          },
        ]);
        return;
      }

      if (res.status === 429) {
        setMessages((m) => [
          ...m,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "You're sending messages quickly — try again in a little while. 🦁",
            ts: Date.now(),
          },
        ]);
        return;
      }

      if (!res.ok) {
        setMessages((m) => [
          ...m,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              data.error ??
              "I'm having a moment — try again in a sec! 🦁",
            ts: Date.now(),
          },
        ]);
        return;
      }

      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: String(data.reply ?? "Sorry, I had trouble with that. Try again!"),
        ts: Date.now(),
      };

      setMessages((m) => [...m, reply]);

      if (!open) {
        setUnread((n) => n + 1);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm having a moment — try again in a sec! 🦁",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  const chatWidth = expanded ? "w-[480px]" : "w-[360px]";
  const chatHeight = expanded ? "h-[600px]" : "h-[480px]";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 relative">
      {open && (
        <div
          className={`${chatWidth} ${chatHeight} flex flex-col overflow-hidden rounded-2xl shadow-2xl transition-all duration-200`}
          style={{
            background: "linear-gradient(180deg, #001a3d 0%, #002a5c 100%)",
            border: "1px solid rgba(192,192,192,0.2)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.1)",
          }}
          role="dialog"
          aria-label="Ed RonIQ Chat"
          aria-modal="false"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg shrink-0 bg-gold-500"
              aria-hidden
            >
              🦁
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">Ed RonIQ</p>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                <p className="text-xs text-white/50">Graduation Assistant · Online</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              aria-label={expanded ? "Minimize chat" : "Expand chat"}
            >
              {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs mt-0.5 bg-gold-500"
                    aria-hidden
                  >
                    🦁
                  </div>
                )}
                <div
                  className="max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "#FFD700", color: "#001a3d", fontWeight: 500 }
                      : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.9)" }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs bg-gold-500"
                  aria-hidden
                >
                  🦁
                </div>
                <div
                  className="flex items-center gap-1 rounded-2xl px-3 py-2"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex gap-1" aria-label="Ed RonIQ is thinking">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full animate-bounce bg-white/50"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void sendMessage(q)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  style={{
                    background: "rgba(255,215,0,0.12)",
                    border: "1px solid rgba(255,215,0,0.25)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {!session && (
            <div
              className="mx-4 mb-3 rounded-xl px-4 py-3 text-xs text-center"
              style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)" }}
            >
              <p className="text-white/70">
                <Link href="/login" className="font-bold text-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded">
                  Sign in
                </Link>{" "}
                to ask Ed RonIQ about your specific graduation status.
              </p>
            </div>
          )}

          <div
            className="flex items-center gap-2 px-3 py-3 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Ed RonIQ..."
              disabled={loading}
              className="flex-1 rounded-full px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 disabled:opacity-50"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
              aria-label="Message Ed RonIQ"
            />
            <button
              type="button"
              onClick={() => void sendMessage(input)}
              disabled={!input.trim() || loading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-40 disabled:hover:scale-100 bg-gold-500"
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5 text-navy-900" />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
        style={{
          background: open
            ? "linear-gradient(135deg, #001a3d, #003B7A)"
            : "linear-gradient(135deg, #FFD700, #FFC200)",
          boxShadow: open ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(255,215,0,0.5)",
        }}
        aria-label={open ? "Close Ed RonIQ" : "Open Ed RonIQ"}
        aria-expanded={open}
      >
        {pulsing && !open && (
          <span
            className="absolute inset-0 rounded-full animate-ping bg-gold-400/40"
            aria-hidden
          />
        )}

        {unread > 0 && !open && (
          <span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white bg-danger"
            aria-label={`${unread} unread messages`}
          >
            {unread}
          </span>
        )}

        {open ? <X className="h-5 w-5 text-white" aria-hidden /> : <span className="text-2xl leading-none" aria-hidden>🦁</span>}
      </button>

      {!open && pulsing && (
        <div
          className="absolute bottom-16 right-0 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium text-white shadow-lg animate-fadeIn pointer-events-none"
          style={{
            background: "linear-gradient(135deg, #001a3d, #003B7A)",
            border: "1px solid rgba(255,215,0,0.3)",
          }}
        >
          Ask Ed RonIQ about graduation 🦁
          <div
            className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 bg-navy-500"
            aria-hidden
          />
        </div>
      )}
    </div>
  );
}
