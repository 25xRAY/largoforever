jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    win: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/wins/route";

describe("GET /api/wins", () => {
  beforeEach(() => {
    jest.mocked(prisma.win.findMany).mockResolvedValue([]);
    jest.mocked(prisma.win.count).mockResolvedValue(0);
  });

  it("returns verified public wins payload", async () => {
    const req = new Request("http://localhost/api/wins");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toEqual([]);
    expect(body.total).toBe(0);
    expect(prisma.win.findMany).toHaveBeenCalled();
    const call = jest.mocked(prisma.win.findMany).mock.calls[0][0];
    expect(call.where.approved).toBe(true);
    expect(call.where.deletedAt).toBe(null);
  });
});
