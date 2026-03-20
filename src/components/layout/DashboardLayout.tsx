"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { CrisisBanner } from "./CrisisBanner";
import { Breadcrumbs } from "./Breadcrumbs";
import { EdRoniqFloat } from "@/components/ai/EdRoniqFloat";

interface DashboardLayoutProps {
  children: React.ReactNode;
  /** Admin panel uses alternate sidebar and nav labels. */
  variant?: "student" | "admin";
}

/**
 * Wraps all /dashboard/* and /admin/* pages. Includes Header, Sidebar, Breadcrumbs, CrisisBanner, main (max-w-7xl), Footer.
 */
export function DashboardLayout({ children, variant = "student" }: DashboardLayoutProps) {
  const Side = variant === "admin" ? AdminSidebar : Sidebar;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CrisisBanner />
      <div className="flex flex-1 pt-16">
        <Side />
        <main id="main-content" className="flex-1 lg:pl-[280px]" tabIndex={-1}>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
      <Footer />
      <EdRoniqFloat />
    </div>
  );
}
