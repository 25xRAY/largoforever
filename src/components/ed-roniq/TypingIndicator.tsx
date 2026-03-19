"use client";

/**
 * Three animated dots in a navy bubble.
 */
export function TypingIndicator() {
  return (
    <div
      className="inline-flex max-w-[80%] rounded-2xl rounded-bl-md bg-navy-100 px-4 py-3"
      role="status"
      aria-label="Ed RonIQ is typing"
    >
      <span className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-navy-500 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-navy-500 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-navy-500" />
      </span>
    </div>
  );
}
