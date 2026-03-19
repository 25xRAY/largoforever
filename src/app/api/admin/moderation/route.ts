import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/admin-session";
import { moderationActionSchema } from "@/lib/validations/admin";

async function audit(
  actorId: string,
  action: string,
  resource: string,
  details: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: {
      userId: actorId,
      action,
      resource,
      details: JSON.stringify(details),
    },
  });
}

/**
 * GET /api/admin/moderation?type=wins|yearbook|comments — pending queues.
 */
export async function GET(request: Request) {
  const staff = await requireStaffSession();
  if (!staff.ok) return staff.response;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "all";

  const [wins, yearbooks, comments] = await Promise.all([
    type === "all" || type === "wins"
      ? prisma.win.findMany({
          where: { approved: false, deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 100,
          select: {
            id: true,
            title: true,
            type: true,
            createdAt: true,
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        })
      : Promise.resolve([]),
    type === "all" || type === "yearbook"
      ? prisma.yearbookPage.findMany({
          where: { status: "PENDING" },
          orderBy: { updatedAt: "desc" },
          take: 100,
          select: {
            id: true,
            slug: true,
            headline: true,
            updatedAt: true,
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        })
      : Promise.resolve([]),
    type === "all" || type === "comments"
      ? prisma.comment.findMany({
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
          take: 100,
          select: {
            id: true,
            content: true,
            relation: true,
            createdAt: true,
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        })
      : Promise.resolve([]),
  ]);

  return NextResponse.json({ wins, yearbooks, comments });
}

/**
 * POST /api/admin/moderation — approve / reject / flag with notes; writes AuditLog.
 */
export async function POST(request: Request) {
  const staff = await requireStaffSession();
  if (!staff.ok) return staff.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = moderationActionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const body = parsed.data;

  try {
    if (body.type === "win") {
      if (body.action === "approve") {
        await prisma.win.update({
          where: { id: body.id },
          data: { approved: true },
        });
      } else if (body.action === "reject") {
        await prisma.win.update({
          where: { id: body.id },
          data: { deletedAt: new Date() },
        });
      }
      await audit(staff.userId, `moderation_win_${body.action}`, "win", {
        id: body.id,
        notes: body.notes,
      });
    }

    if (body.type === "yearbook") {
      if (body.action === "approve") {
        await prisma.yearbookPage.update({
          where: { id: body.id },
          data: { status: "APPROVED", publishedAt: new Date() },
        });
      } else if (body.action === "reject") {
        await prisma.yearbookPage.update({
          where: { id: body.id },
          data: { status: "REJECTED" },
        });
      }
      await audit(staff.userId, `moderation_yearbook_${body.action}`, "yearbook", {
        id: body.id,
        notes: body.notes,
      });
    }

    if (body.type === "comment") {
      if (body.action === "approve") {
        await prisma.comment.update({
          where: { id: body.id },
          data: { status: "APPROVED" },
        });
      } else if (body.action === "reject" || body.action === "flag") {
        await prisma.comment.update({
          where: { id: body.id },
          data: { status: "REJECTED" },
        });
      }
      await audit(staff.userId, `moderation_comment_${body.action}`, "comment", {
        id: body.id,
        notes: body.notes,
      });
    }
  } catch {
    return NextResponse.json({ error: "Item not found or update failed" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
