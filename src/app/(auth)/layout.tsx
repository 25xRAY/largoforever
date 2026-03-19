import { Logo } from "@/components/layout/Logo";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-600 via-navy-700 to-navy-900 flex flex-col items-center justify-center px-4 py-12">
      <Logo className="h-16 w-16 text-gold-500 shrink-0" aria-hidden />
      {children}
    </div>
  );
}
