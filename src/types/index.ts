import type { AlertType as PrismaAlertType } from "@prisma/client";

export interface PageSEOConfig {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export type AlertType = PrismaAlertType;

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  priority: "GREEN" | "YELLOW" | "RED";
  actionUrl?: string;
  createdAt: Date;
}

export interface ReadinessData {
  creditsPercent: number;
  assessmentsPercent: number;
  servicePercent: number;
  obligationsMet: boolean;
  ccrMet: boolean;
  overallPercent: number;
}

export interface SubjectCredit {
  subject: string;
  required: number;
  earned: number;
  percent: number;
}

export interface DashboardData {
  readiness: ReadinessData;
  alerts: Alert[];
  recentWins: unknown[];
  yearbookStatus: "none" | "draft" | "pending" | "published";
}

export interface WinWithStudent {
  id: string;
  type: string;
  title: string;
  description: string | null;
  approved: boolean;
  createdAt: Date;
  user: { firstName: string | null; lastName: string | null; image: string | null };
}

export interface YearbookPageWithComments {
  id: string;
  headline: string | null;
  quote: string | null;
  status: string;
  publishedAt: Date | null;
  comments: CommentWithReplies[];
  user: { firstName: string | null; lastName: string | null; image: string | null };
}

export interface CommentWithReplies {
  id: string;
  content: string;
  status: string;
  createdAt: Date;
  user: { firstName: string | null; lastName: string | null };
}

export interface LeaderboardEntryWithUser {
  id: string;
  category: string;
  value: number;
  rank: number | null;
  period: string;
  user: { firstName: string | null; lastName: string | null; image: string | null };
}

export interface AuditLogEntry {
  id: string;
  action: string;
  resource: string;
  details: string | null;
  createdAt: Date;
  user: { email: string } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}
