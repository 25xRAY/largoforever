import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ProfileClient } from "@/components/dashboard/ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | Largo Lions Class of 2026",
  description: "Manage your Class of 2026 profile, privacy settings, and academic highlights.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">My Profile</h1>
        <p className="mt-1 text-sm text-navy-600">
          Update your information, privacy settings, and academic highlights.
        </p>
      </div>

      <ProfileClient />
    </div>
  );
}
