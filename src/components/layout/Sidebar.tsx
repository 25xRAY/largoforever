"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  Trophy,
  BookOpen,
  Award,
  FileText,
  Sparkles,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

const STUDENT_SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/checklist", label: "Graduation Checklist", icon: ClipboardCheck },
  { href: "/wall-of-wins", label: "Wall of Wins", icon: Trophy },
  { href: "/yearbook", label: "Yearbook", icon: BookOpen },
  { href: "/leaderboards", label: "Leaderboards", icon: Award },
  { href: "/resources", label: "Resources", icon: FileText },
  { href: "/dashboard/ed-roniq", label: "Ed RonIQ", icon: Sparkles },
] as const;

const TEACHER_SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/wall-of-wins", label: "Wall of Wins", icon: Trophy },
  { href: "/leaderboards", label: "Leaderboards", icon: Award },
  { href: "/resources", label: "Resources", icon: FileText },
] as const;

const BOTTOM_LINKS = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/help", label: "Help", icon: HelpCircle },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarLinks =
    session?.user?.role === "TEACHER" ? TEACHER_SIDEBAR_LINKS : STUDENT_SIDEBAR_LINKS;

  const content = (
    <>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Sidebar">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-button px-3 py-2 text-sm font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2",
                isActive
                  ? "bg-navy-100 text-navy-900 border-l-4 border-gold-500"
                  : "text-navy-700 hover:bg-navy-50 hover:text-navy-900"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-navy-200 px-3 py-4">
        {BOTTOM_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-button px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
        {session?.user && (
          <div className="mt-4 flex items-center gap-3 rounded-card bg-navy-50 p-3">
            <Avatar
              size="sm"
              name={session.user.name ?? session.user.email ?? undefined}
              image={session.user.image ?? undefined}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy-900">
                {session.user.firstName} {session.user.lastName}
              </p>
              <p className="truncate text-xs text-navy-600 capitalize">
                {session.user.role?.toLowerCase()}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-[280px] flex-col border-r border-navy-200 bg-white transition-transform",
          "lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-[280px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar"
      >
        {content}
      </aside>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy-900/50 lg:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
