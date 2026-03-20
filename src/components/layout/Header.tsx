"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "./Logo";
import * as Dropdown from "@radix-ui/react-dropdown-menu";

export function Header() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-navy-500 shadow-nav" role="banner">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-navy-500 rounded"
          aria-label="Largo Lions 26 - Home"
        >
          <Logo className="h-10 w-10 shrink-0" />
          <span className="font-heading text-lg font-bold">Largo Lions &apos;26</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white",
                "focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-navy-500",
                "border-b-2 border-transparent hover:border-gold-500"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <span className="text-sm text-white/80">...</span>
          ) : session?.user ? (
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-navy-500"
                  aria-label="Open user menu"
                >
                  <Avatar
                    size="sm"
                    name={session.user.name ?? session.user.email ?? undefined}
                    image={session.user.image ?? undefined}
                    showRing
                  />
                </button>
              </Dropdown.Trigger>
              <Dropdown.Portal>
                <Dropdown.Content
                  className="min-w-[200px] rounded-card border border-navy-200 bg-white p-2 shadow-card z-[100]"
                  align="end"
                  sideOffset={8}
                >
                  <div className="border-b border-navy-100 px-3 py-2">
                    <p className="font-heading font-semibold text-navy-900">
                      {session.user.firstName} {session.user.lastName}
                    </p>
                    <p className="text-xs text-navy-600 capitalize">
                      {session.user.role?.toLowerCase()}
                    </p>
                  </div>
                  <Dropdown.Item asChild>
                    <Link
                      href="/dashboard/profile"
                      className="block rounded px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 cursor-pointer outline-none"
                    >
                      Profile
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item asChild>
                    <Link
                      href="/dashboard/settings"
                      className="block rounded px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 cursor-pointer outline-none"
                    >
                      Settings
                    </Link>
                  </Dropdown.Item>
                  {(session.user.role === "ADMIN" ||
                    session.user.role === "ADMINISTRATOR" ||
                    session.user.role === "MODERATOR" ||
                    session.user.role === "COUNSELOR") && (
                    <Dropdown.Item asChild>
                      <Link
                        href="/admin"
                        className="block rounded px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 cursor-pointer outline-none"
                      >
                        Staff panel
                      </Link>
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item
                    onSelect={() => signOut({ callbackUrl: "/" })}
                    className="rounded px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 cursor-pointer outline-none"
                  >
                    Sign Out
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Portal>
            </Dropdown.Root>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          )}

          <button
            type="button"
            className="md:hidden rounded p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-500"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden border-t border-white/20 bg-navy-600 px-4 py-4"
          role="dialog"
          aria-label="Mobile menu"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded px-3 py-2 text-white hover:bg-white/10 font-medium border-l-4 border-gold-500 pl-4"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session?.user &&
              (session.user.role === "ADMIN" ||
                session.user.role === "ADMINISTRATOR" ||
                session.user.role === "MODERATOR" ||
                session.user.role === "COUNSELOR") && (
                <Link
                  href="/admin"
                  className="rounded px-3 py-2 text-white hover:bg-white/10 font-medium border-l-4 border-gold-500 pl-4"
                  onClick={() => setMobileOpen(false)}
                >
                  Staff panel
                </Link>
              )}
          </nav>
        </div>
      )}
    </header>
  );
}
