"use client";

import { cn } from "@/lib/utils";

export interface ChatBubble {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

interface ChatMessageProps {
  message: ChatBubble;
}

/**
 * Student: gold right-aligned. Ed RonIQ: navy left-aligned.
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const time = new Date(message.createdAt).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "rounded-br-md bg-gold-400 text-navy-900"
            : "rounded-bl-md bg-navy-100 text-navy-900"
        )}
      >
        {!isUser && (
          <p className="text-xs font-semibold text-navy-600">
            Ed RonIQ 🦁 <span className="font-normal text-navy-500">{time}</span>
          </p>
        )}
        <p className={cn("whitespace-pre-wrap text-sm", !isUser && "mt-1")}>{message.content}</p>
        {isUser && <p className="mt-1 text-right text-xs text-navy-800/80">{time}</p>}
      </div>
    </div>
  );
}
