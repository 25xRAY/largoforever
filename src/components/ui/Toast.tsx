"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { forwardRef, createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const toastVariants = {
  success: "bg-success-light text-success-dark border-success",
  error: "bg-danger-light text-danger-dark border-danger",
  warning: "bg-warning-light text-warning-dark border-warning",
  info: "bg-info-light text-info-dark border-info",
} as const;

const TOAST_LIMIT = 3;
const TOAST_DURATION = 5000;

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: keyof typeof toastVariants;
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (opts: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within Toaster");
  return ctx;
}

interface ToasterProps {
  children: ReactNode;
}

export function Toaster({ children }: ToasterProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((opts: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => {
      const next = [...prev, { ...opts, id }];
      return next.slice(-TOAST_LIMIT);
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastPrimitive.Provider swipeDirection="right">
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            open
            onOpenChange={(open) => !open && dismiss(t.id)}
            duration={TOAST_DURATION}
            className={cn(
              "grid w-full max-w-sm grid-cols-[1fr_auto] items-center gap-2 rounded-card border-2 p-4 shadow-card",
              toastVariants[t.variant]
            )}
          >
            <div>
              <ToastPrimitive.Title className="font-heading font-semibold">
                {t.title}
              </ToastPrimitive.Title>
              {t.description && (
                <ToastPrimitive.Description className="mt-0.5 text-sm opacity-90">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close
              className="rounded p-1 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gold-500"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-sm" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export type ToastVariant = keyof typeof toastVariants;
