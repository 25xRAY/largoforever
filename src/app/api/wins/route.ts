import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { winSubmissionSchema, winFilterSchema } from "@/lib/validations/wins";

const DEFAULT_LIMIT = 24;

/**
 * GET — public. Verified + non-deleted wins, paginated, filterable, searchable.
 * POST — authenticated. Create win (approved=false). Zod validation.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = winFilterSchema.safeParse({
    type: searchParams.get("type") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    sort: searchParams.get("sort") ?? "newest",
    page: searchParams.get("page") ?? 1,
    limit: searchParams.get("limit") ?? DEFAULT_LIMIT,
  });

  const filters = parsed.success
    ? parsed.data
    : { sort: "newest" as const, page: 1, limit: DEFAULT_LIMIT };
  const page = filters.page ?? 1;
  const limit = filters.limit ?? DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const where = {
    approved: true,
    deletedAt: null,
    ...(filters.type && { type: filters.type }),
    ...(filters.search &&
      filters.search.trim() && {
        OR: [
          { title: { contains: filters.search.trim(), mode: "insensitive" as const } },
          { institutionName: { contains: filters.search.trim(), mode: "insensitive" as const } },
          { description: { contains: filters.search.trim(), mode: "insensitive" as const } },
        ],
      }),
  };

  const orderBy =
    filters.sort === "oldest"
      ? { createdAt: "asc" as const }
      : filters.sort === "highest"
        ? { amount: "desc" as const }
        : { createdAt: "desc" as const };

  const [wins, total] = await Promise.all([
    prisma.win.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    }),
    prisma.win.count({ where }),
  ]);

  return NextResponse.json({
    data: wins.map((w) => ({
      id: w.id,
      type: w.type,
      title: w.title,
      description: w.description,
      institutionName: w.institutionName,
      institutionType: w.institutionType,
      scholarshipRange: w.scholarshipRange,
      scholarshipType: w.scholarshipType,
      militaryBranch: w.militaryBranch,
      amount: w.amount,
      evidenceUrl: w.evidenceUrl,
      approved: w.approved,
      createdAt: w.createdAt.toISOString(),
      user: w.user ? { firstName: w.user.firstName, lastName: w.user.lastName } : null,
    })),
    total,
    page,
    limit,
    hasMore: skip + wins.length < total,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = winSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const win = await prisma.win.create({
      data: {
        userId: session.user.id as string,
        type: data.type,
        title: data.title,
        description: data.description ?? null,
        institutionName: data.institutionName ?? null,
        institutionType: data.institutionType ?? null,
        scholarshipRange: data.scholarshipRange ?? null,
        scholarshipType: data.scholarshipType ?? null,
        militaryBranch: data.militaryBranch ?? null,
        amount: data.amount ?? null,
        evidenceUrl: data.evidenceUrl ?? null,
        approved: false,
      },
    });

    return NextResponse.json({
      id: win.id,
      type: win.type,
      title: win.title,
      createdAt: win.createdAt.toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to submit win" }, { status: 500 });
  }
}
