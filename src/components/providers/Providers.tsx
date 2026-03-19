"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { getQueryClientDefaultOptions } from "@/lib/cache";
import { Toaster } from "@/components/ui/Toast";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Single client boundary: NextAuth session, React Query, and toast context (wraps all app content).
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: getQueryClientDefaultOptions(),
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster>{children}</Toaster>
      </QueryClientProvider>
    </SessionProvider>
  );
}
