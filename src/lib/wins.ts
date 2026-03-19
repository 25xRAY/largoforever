import { prisma } from "./prisma";

export async function getWinById(id: string) {
  const win = await prisma.win.findUnique({
    where: { id, deletedAt: null },
    include: {
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  });
  if (!win) return null;
  const isPublic = win.approved;
  return { win, isPublic };
}
