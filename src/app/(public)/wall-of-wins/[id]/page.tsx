import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { getWinById } from "@/lib/wins";

export default async function WinDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getWinById(id);
  if (!result || !result.isPublic) notFound();
  const win = result.win;

  const studentName = win.user
    ? [win.user.firstName, win.user.lastName].filter(Boolean).join(" ") || "A Largo Lion"
    : "A Largo Lion";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/wall-of-wins" className="text-gold-600 hover:underline text-sm">
        ← Back to Wall of Wins
      </Link>
      <article className="rounded-card border-2 border-navy-200 bg-white p-8 shadow-card">
        <div className="flex flex-wrap gap-2">
          <Badge variant="gold">{win.type.replace(/_/g, " ")}</Badge>
          {win.approved && <span className="text-sm text-success">Verified ✅</span>}
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-navy-900">{win.title}</h1>
        {win.institutionName && <p className="mt-2 text-navy-600">{win.institutionName}</p>}
        {win.type === "SCHOLARSHIP" && win.amount != null && win.amount > 0 && (
          <p className="mt-2 font-medium text-gold-600">{formatCurrency(win.amount)}</p>
        )}
        {win.type === "MILITARY" && win.militaryBranch && (
          <p className="mt-2 text-navy-600">Branch: {win.militaryBranch.replace(/_/g, " ")}</p>
        )}
        {win.description && <p className="mt-4 text-navy-700">{win.description}</p>}
        <p className="mt-6 text-sm text-navy-500">{studentName}</p>
        <p className="text-xs text-navy-400">{win.createdAt.toLocaleDateString()}</p>
        {win.evidenceUrl && (
          <a
            href={win.evidenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-gold-600 hover:underline text-sm"
          >
            View evidence →
          </a>
        )}
      </article>
    </div>
  );
}
