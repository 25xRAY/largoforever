import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RATE_LIMIT = 100;
const RATE_WINDOW_MS = 60_000;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function getClientId(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.ip ?? "unknown";
}

function isRateLimited(clientId: string, pathname: string): boolean {
  if (!pathname.startsWith("/api/")) return false;
  const now = Date.now();
  let entry = rateMap.get(clientId);
  if (!entry) {
    entry = { count: 0, resetAt: now + RATE_WINDOW_MS };
    rateMap.set(clientId, entry);
  }
  if (now >= entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (isRateLimited(getClientId(req), pathname)) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isApiStudent = pathname.startsWith("/api/student");
  const isPublic =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/wall-of-wins") ||
    pathname === "/yearbook" ||
    pathname.startsWith("/yearbook/") ||
    pathname === "/resources" ||
    pathname === "/leaderboards" ||
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/api/leaderboards") ||
    pathname.startsWith("/api/resources");

  if (pathname.startsWith("/api/ai/")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = token.role as string;
    if (role !== "STUDENT" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  const isApiTeacher = pathname.startsWith("/api/teacher");
  if (isApiTeacher) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if ((token.role as string) !== "TEACHER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (isPublic && token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const teacherBlockedPaths = ["/dashboard/checklist", "/dashboard/ed-roniq", "/dashboard/yearbook"];

  if (isDashboard && token) {
    const role = token.role as string;
    const allowedDashboard =
      role === "STUDENT" || role === "ADMIN" || role === "TEACHER" || role === "COUNSELOR";
    if (!allowedDashboard) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (role === "TEACHER") {
      const blocked = teacherBlockedPaths.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
      );
      if (blocked) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  if ((isAdmin || pathname.startsWith("/api/admin")) && token) {
    const role = token.role as string;
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  if ((isAdmin || pathname.startsWith("/api/admin")) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isApiStudent && token) {
    const role = token.role as string;
    if (role !== "STUDENT" && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
