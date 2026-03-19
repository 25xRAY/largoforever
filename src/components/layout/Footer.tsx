import Link from "next/link";
import { SITE_NAME, FOOTER_LINKS } from "@/lib/constants";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              <Logo className="h-10 w-10" />
              <span className="font-heading text-lg font-bold">{SITE_NAME}</span>
            </Link>
            <p className="mt-2 text-sm text-white/80">Legacy in Motion...Altitude Achieved!</p>
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-500">
              Quick links
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-500">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-sm text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-8">
          <p className="text-center text-sm text-white/70">
            Built with 💙 by Talent Ready Class of 2028
          </p>
          <p className="mt-1 text-center text-xs text-white/50">
            Not officially affiliated with PGCPS.
          </p>
        </div>
      </div>
    </footer>
  );
}
