"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { CrisisBanner } from "./CrisisBanner";
import { Breadcrumbs } from "./Breadcrumbs";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Wraps all /dashboard/* and /admin/* pages. Includes Header, Sidebar, Breadcrumbs, CrisisBanner, main (max-w-7xl), Footer.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main
          id="main-content"
          className="flex-1 lg:pl-[280px]"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
