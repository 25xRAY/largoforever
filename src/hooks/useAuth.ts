"use client";

import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import type { UserRole } from "@prisma/client";

export interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const user = session?.user as AuthUser | undefined;

  const isAuthenticated = status === "authenticated" && Boolean(user);
  const isLoading = status === "loading";
  const isStudent = user?.role === "STUDENT";
  const isAdmin = user?.role === "ADMIN";
  const isModerator = user?.role === "MODERATOR";

  const signOut = (options?: { callbackUrl?: string }) => {
    return nextAuthSignOut(options);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isStudent,
    isAdmin,
    isModerator,
    signOut,
  };
}
