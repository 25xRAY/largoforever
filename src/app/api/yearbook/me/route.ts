import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET — authenticated. Returns the current user's yearbook page (if any). 404 if none.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = await prisma.yearbookPage.findUnique({
    where: { userId: session.user.id as string },
  });

  if (!page) {
    return NextResponse.json({ error: "No yearbook page" }, { status: 404 });
  }

  return NextResponse.json({
    ...page,
    favoriteMemories: page.favoriteMemories ? (JSON.parse(page.favoriteMemories) as string[]) : [],
    galleryPhotos: page.galleryPhotos ? (JSON.parse(page.galleryPhotos) as string[]) : [],
  });
}
