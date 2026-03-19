"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, ShieldCheck, Users, Award, Download, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

const LINKS = [
  { href: "/admin", label: "Admin dashboard", icon: LayoutDashboard },
  { href: "/admin/moderation", label: "Moderation", icon: ShieldCheck },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/leaderboards", label: "Leaderboards", icon: Award },
  { href: "/admin/data-export", label: "Data export", icon: Download },
] as const;

/**
 * Sidebar for `/admin/*` with staff navigation and role badge.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const roleLabel = session?.user?.role === "MODERATOR" ? "Moderator" : "Admin";

  return (
    <aside
      className="fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-[280px] flex-col border-r border-navy-200 bg-white lg:translate-x-0"
      aria-label="Admin sidebar"
    >
      <div className="border-b border-navy-200 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Staff panel</p>
        <p className="font-heading text-sm font-bold text-navy-900">Largo Lions &apos;26</p>
        <span className="mt-1 inline-block rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-navy-800">
          {roleLabel}
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Admin navigation">
        {LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
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
                  : "text-navy-700 hover:bg-navy-50"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/dashboard"
          className="mt-4 flex items-center gap-2 rounded-button px-3 py-2 text-sm text-navy-600 hover:bg-navy-50"
        >
          <LayoutList className="h-4 w-4" aria-hidden />
          Back to student app
        </Link>
      </nav>
      {session?.user && (
        <div className="mt-auto border-t border-navy-200 p-3">
          <div className="flex items-center gap-3 rounded-card bg-navy-50 p-3">
            <Avatar
              size="sm"
              name={session.user.name ?? session.user.email ?? undefined}
              image={session.user.image ?? undefined}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy-900">
                {session.user.firstName} {session.user.lastName}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
