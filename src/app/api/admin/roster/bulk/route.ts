import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-session";
import { UserRole } from "@prisma/client";
import { normalizeRosterEmail } from "@/lib/roster";

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

/**
 * POST /api/admin/roster/bulk — body: text/csv with header email,firstName,lastName,role
 */
export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin.ok) return admin.response;

  const text = await request.text();
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return NextResponse.json(
      { error: "CSV must include a header row and at least one data row." },
      { status: 400 }
    );
  }

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const emailIdx = header.indexOf("email");
  const fnIdx = header.indexOf("firstname");
  const lnIdx = header.indexOf("lastname");
  const roleIdx = header.indexOf("role");
  if (emailIdx < 0 || fnIdx < 0 || lnIdx < 0 || roleIdx < 0) {
    return NextResponse.json(
      {
        error:
          "CSV header must include columns: email, firstName, lastName, role (case-insensitive).",
      },
      { status: 400 }
    );
  }

  let imported = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const emailRaw = cols[emailIdx];
    const firstName = cols[fnIdx] ?? "";
    const lastName = cols[lnIdx] ?? "";
    const roleRaw = (cols[roleIdx] ?? "").toUpperCase().trim();
    if (!emailRaw) {
      errors.push(`Row ${i + 1}: missing email`);
      continue;
    }
    const email = normalizeRosterEmail(emailRaw);
    if (!Object.values(UserRole).includes(roleRaw as UserRole)) {
      errors.push(`Row ${i + 1}: invalid role "${roleRaw}"`);
      continue;
    }
    const role = roleRaw as UserRole;
    try {
      await prisma.approvedRoster.upsert({
        where: { email },
        create: { email, firstName, lastName, role },
        update: { firstName, lastName, role },
      });
      imported++;
    } catch (e) {
      errors.push(`Row ${i + 1}: ${String(e)}`);
    }
  }

  if (imported === 0 && errors.length > 0) {
    return NextResponse.json({ error: "Import failed", details: errors }, { status: 400 });
  }

  return NextResponse.json({ imported, errors: errors.length ? errors : undefined });
}
