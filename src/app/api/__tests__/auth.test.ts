jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
}));

import { prisma } from "@/lib/prisma";
import { POST as registerPOST } from "@/app/api/auth/register/route";

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(prisma.user.findUnique).mockResolvedValue(null);
    jest.mocked(prisma.user.create).mockImplementation(async (args) => ({
      id: "u1",
      email: args.data.email,
      firstName: args.data.firstName,
      lastName: args.data.lastName,
    }));
  });

  it("returns 400 for invalid body", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await registerPOST(req);
    expect(res.status).toBe(400);
  });

  it("returns 409 for duplicate email", async () => {
    jest.mocked(prisma.user.findUnique).mockResolvedValue({ id: "existing" });
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "taken@school.edu",
        password: "SecurePass1!",
        confirmPassword: "SecurePass1!",
        firstName: "Ab",
        lastName: "Cd",
        acceptTerms: true,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await registerPOST(req);
    expect(res.status).toBe(409);
  });

  it("returns 201 for valid registration", async () => {
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "fresh@school.edu",
        password: "SecurePass1!",
        confirmPassword: "SecurePass1!",
        firstName: "New",
        lastName: "Student",
        acceptTerms: true,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await registerPOST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.user.email).toBe("fresh@school.edu");
  });
});
