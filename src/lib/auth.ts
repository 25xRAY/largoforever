import type { NextAuthOptions } from "next-auth";
import type { UserRole } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logger } from "./logger";
import { normalizeRosterEmail } from "./roster";

const allowedDomains = ["students.pgcps.org", "pgcps.org"];

/** True when NextAuth is configured for local development (any Gmail OK for Google sign-in). */
function isGoogleAuthDevMode(): boolean {
  const url = process.env.NEXTAUTH_URL ?? "";
  return url.includes("localhost");
}

function isAllowedEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? allowedDomains.includes(domain) : false;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    error: "/login?error=true",
    newUser: "/onboarding",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      ...(isGoogleAuthDevMode()
        ? {}
        : {
            authorization: {
              params: {
                hd: "pgcps.org",
              },
            },
          }),
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user?.password) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (
        account?.provider === "google" &&
        user.email &&
        !isGoogleAuthDevMode() &&
        !isAllowedEmail(user.email)
      ) {
        return false;
      }
      if (account?.provider === "google" && user.email) {
        if (!isGoogleAuthDevMode()) {
          const email = normalizeRosterEmail(user.email);
          const existingUser = await prisma.user.findUnique({ where: { email } });
          if (!existingUser) {
            const roster = await prisma.approvedRoster.findUnique({ where: { email } });
            if (!roster) {
              return "/login?error=NotOnRoster";
            }
          }
        }
      }
      if (user.id) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: "sign_in",
              resource: "auth",
              details: JSON.stringify({ provider: account?.provider ?? "credentials" }),
            },
          });
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });
        } catch (e) {
          logger.error("AuditLog signIn", { error: String(e) });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.id && user.email && account?.provider === "google") {
        const email = normalizeRosterEmail(user.email);
        const roster = await prisma.approvedRoster.findUnique({ where: { email } });
        if (roster) {
          try {
            await prisma.$transaction([
              prisma.user.update({
                where: { id: user.id },
                data: {
                  role: roster.role,
                  firstName: roster.firstName,
                  lastName: roster.lastName,
                  name: `${roster.firstName} ${roster.lastName}`,
                },
              }),
              prisma.approvedRoster.update({
                where: { id: roster.id },
                data: { used: true },
              }),
            ]);
          } catch (e) {
            logger.error("Roster sync on Google jwt", { error: String(e) });
          }
        }
      }
      if (user) {
        token.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, firstName: true, lastName: true, image: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.picture = dbUser.image ?? token.picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.firstName = token.firstName as string | null;
        session.user.lastName = token.lastName as string | null;
        session.user.image = (token.picture as string) ?? session.user.image;
      }
      return session;
    },
  },
};
