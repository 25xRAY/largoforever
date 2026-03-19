import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET — public if verified (approved) or owner. Otherwise 404.
 * PATCH — owner only, unverified only. Partial update.
 * DELETE — owner only. Soft-delete (set deletedAt).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string | undefined;

  const win = await prisma.win.findUnique({
    where: { id, deletedAt: null },
    include: {
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!win) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = userId && win.userId === userId;
  const isPublic = win.approved;

  if (!isPublic && !isOwner) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: win.id,
    type: win.type,
    title: win.title,
    description: win.description,
    institutionName: win.institutionName,
    institutionType: win.institutionType,
    scholarshipRange: win.scholarshipRange,
    scholarshipType: win.scholarshipType,
    militaryBranch: win.militaryBranch,
    amount: win.amount,
    evidenceUrl: win.evidenceUrl,
    approved: win.approved,
    createdAt: win.createdAt.toISOString(),
    user: win.user
      ? {
          id: win.user.id,
          firstName: win.user.firstName,
          lastName: win.user.lastName,
        }
      : null,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const win = await prisma.win.findUnique({
    where: { id, deletedAt: null },
  });

  if (!win || win.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (win.approved) {
    return NextResponse.json({ error: "Approved wins cannot be edited" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    const allowed = [
      "title",
      "description",
      "institutionName",
      "institutionType",
      "scholarshipRange",
      "scholarshipType",
      "militaryBranch",
      "amount",
      "evidenceUrl",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    const updated = await prisma.win.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      id: updated.id,
      type: updated.type,
      title: updated.title,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const win = await prisma.win.findUnique({
    where: { id, deletedAt: null },
  });

  if (!win || win.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.win.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
