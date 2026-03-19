"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Trophy } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

interface WinItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  institutionName: string | null;
  studentName: string;
}

interface RecentWinsProps {
  wins: WinItem[];
}

function formatWinType(type: string): string {
  return type.replace(/_/g, " ");
}

/**
 * 3 latest verified wins. Type badge, institution, student name, description. "View All →". Empty state.
 */
export function RecentWins({ wins }: RecentWinsProps) {
  if (wins.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        heading="No wins yet"
        description="When your classmates share scholarships and acceptances, they’ll show up here."
        actionLabel="View Wall of Wins"
        actionHref="/wall-of-wins"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3" role="list">
        {wins.map((w) => (
          <li key={w.id}>
            <div className="rounded-card border border-navy-200 bg-white p-4 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="gold" size="sm">
                  {formatWinType(w.type)}
                </Badge>
                {w.institutionName && (
                  <span className="text-sm text-navy-600">{w.institutionName}</span>
                )}
              </div>
              <p className="mt-2 font-medium text-navy-900">{w.title}</p>
              {w.description && (
                <p className="mt-1 text-sm text-navy-600 line-clamp-2">{w.description}</p>
              )}
              <p className="mt-2 text-xs text-navy-500">{w.studentName}</p>
            </div>
          </li>
        ))}
      </ul>
      <Link
        href="/wall-of-wins"
        className="inline-block text-sm font-medium text-gold-600 hover:text-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
      >
        View All →
      </Link>
    </div>
  );
}
