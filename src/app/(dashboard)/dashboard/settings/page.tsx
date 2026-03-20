"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { COUNSELOR_INFO, CRISIS_RESOURCES } from "@/lib/constants";

type ToastState = { message: string; type: "success" | "error" } | null;

function Section({
  title,
  description,
  children,
  danger,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  const id = `section-${title.replace(/\s/g, "-").toLowerCase()}`;
  return (
    <section
      className={`rounded-card border bg-white p-6 shadow-card ${
        danger ? "border-danger-light" : "border-navy-200"
      }`}
      aria-labelledby={id}
    >
      <div className="mb-5 border-b border-navy-100 pb-4">
        <h2
          id={id}
          className={`font-heading text-lg font-semibold ${
            danger ? "text-danger-dark" : "text-navy-900"
          }`}
        >
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-navy-600">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  id,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium text-navy-900 cursor-pointer">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs text-navy-600">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 ${
          checked ? "bg-navy-700" : "bg-navy-200"
        }`}
      >
        <span
          aria-hidden
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [toast, setToast] = useState<ToastState>(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [hasPassword, setHasPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const [privacy, setPrivacy] = useState({
    yearbookPublic: true,
    leaderboardOptIn: false,
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((body: unknown) => {
        if (typeof body === "object" && body !== null && "user" in body) {
          const user = (body as { user: { yearbookPublic?: boolean; leaderboardOptIn?: boolean; hasPassword?: boolean } }).user;
          if (user) {
            setPrivacy({
              yearbookPublic: user.yearbookPublic ?? true,
              leaderboardOptIn: user.leaderboardOptIn ?? false,
            });
            setHasPassword(user.hasPassword === true);
          }
        }
      })
      .catch(() => {});
  }, []);

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  }

  async function handlePasswordChange() {
    const errs: Record<string, string> = {};
    if (!passwordForm.currentPassword) errs.currentPassword = "Required.";
    if (passwordForm.newPassword.length < 8) errs.newPassword = "Must be at least 8 characters.";
    if (!/[A-Z]/.test(passwordForm.newPassword))
      errs.newPassword = "Must include an uppercase letter.";
    if (!/[0-9]/.test(passwordForm.newPassword)) errs.newPassword = "Must include a number.";
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    setPasswordErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => ({}));
        const msg =
          typeof data === "object" && data !== null && "error" in data
            ? String((data as { error: unknown }).error)
            : "Incorrect password.";
        setPasswordErrors({ currentPassword: msg });
        return;
      }
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setHasPassword(true);
      showToast("Password updated successfully.", "success");
    } catch {
      showToast("Something went wrong. Try again.", "error");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handlePrivacySave() {
    setSavingPrivacy(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(privacy),
      });
      if (!res.ok) throw new Error();
      showToast("Privacy settings saved.", "success");
    } catch {
      showToast("Could not save settings. Try again.", "error");
    } finally {
      setSavingPrivacy(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE") return;
    setDeletingAccount(true);
    try {
      const res = await fetch("/api/user/me", { method: "DELETE" });
      if (!res.ok) throw new Error();
      await signOut({ redirect: false });
      router.push("/?deleted=1");
    } catch {
      showToast("Could not delete account. Contact your counselor.", "error");
      setDeletingAccount(false);
    }
  }

  const role = session?.user?.role;
  const isStudent = role === "STUDENT";

  return (
    <div className="space-y-8 pb-16">
      {toast && (
        <div
          role="alert"
          className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-card px-5 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "success" ? "bg-success text-white" : "bg-danger text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div>
        <h1 className="font-heading text-2xl font-bold text-navy-900">Settings</h1>
        <p className="mt-1 text-sm text-navy-600">
          Manage your account, privacy, and security preferences.
        </p>
      </div>

      <Section
        title="Password"
        description="Change your sign-in password. Requires your current password."
      >
        {!hasPassword ? (
          <p className="text-sm text-navy-600">
            You signed in with Google only (no password on file). Use Forgot Password on the login
            page if you need to add email/password sign-in, or continue using Google.
          </p>
        ) : (
          <div className="space-y-4 max-w-sm">
            <Input
              label="Current password"
              type="password"
              autoComplete="current-password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))
              }
              errorMessage={passwordErrors.currentPassword}
            />
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              errorMessage={passwordErrors.newPassword}
            />
            <Input
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))
              }
              errorMessage={passwordErrors.confirmPassword}
            />
            <Button
              type="button"
              onClick={() => void handlePasswordChange()}
              isLoading={savingPassword}
              loadingText="Updating…"
              variant="primary"
            >
              Update Password
            </Button>
          </div>
        )}
      </Section>

      {isStudent && (
        <Section
          title="Privacy"
          description="Control what classmates and the public can see about you."
        >
          <div className="divide-y divide-navy-100">
            <Toggle
              id="yearbook-public"
              label="Public Yearbook Page"
              description="Anyone with the link can view your digital yearbook page."
              checked={privacy.yearbookPublic}
              onChange={(v) => setPrivacy((p) => ({ ...p, yearbookPublic: v }))}
            />
            <Toggle
              id="leaderboard-opt-in"
              label="Appear on Leaderboards"
              description="Show your name and academic highlights on the Lions of Distinction leaderboard."
              checked={privacy.leaderboardOptIn}
              onChange={(v) => setPrivacy((p) => ({ ...p, leaderboardOptIn: v }))}
            />
          </div>
          <div className="mt-5">
            <Button
              type="button"
              onClick={() => void handlePrivacySave()}
              isLoading={savingPrivacy}
              loadingText="Saving…"
              variant="primary"
            >
              Save Privacy Settings
            </Button>
          </div>
        </Section>
      )}

      <Section title="Account Information">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-navy-600">Email</dt>
            <dd className="font-medium text-navy-900 text-right break-all">{session?.user?.email ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-navy-600">Role</dt>
            <dd className="font-medium text-navy-900 capitalize">{role?.toLowerCase() ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-navy-600">Sign-in method</dt>
            <dd className="font-medium text-navy-900">
              {hasPassword ? "Email & password (and/or Google)" : "Google (no password on file)"}
            </dd>
          </div>
        </dl>
      </Section>

      <Section
        title="Need Help?"
        description="Reach out to your counselor or crisis support services."
      >
        <div className="space-y-4 text-sm">
          <div className="rounded-lg bg-navy-50 p-4">
            <p className="font-semibold text-navy-900">{COUNSELOR_INFO.name}</p>
            <p className="text-navy-600">School Counselor</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={`mailto:${COUNSELOR_INFO.email}`}
                className="text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
              >
                {COUNSELOR_INFO.email}
              </a>
              <span className="text-navy-400">·</span>
              <a
                href={`tel:${COUNSELOR_INFO.phone}`}
                className="text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
              >
                {COUNSELOR_INFO.phone}
              </a>
            </div>
            <a
              href={COUNSELOR_INFO.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-medium text-gold-600 hover:underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
            >
              Book an appointment →
            </a>
          </div>

          <div className="rounded-lg border border-danger-light bg-danger-light/20 p-4">
            <p className="font-semibold text-danger-dark">Crisis Support — Available 24/7</p>
            <div className="mt-2 space-y-1">
              <p className="text-danger-dark">
                <strong>{CRISIS_RESOURCES.nationalSuicide.name}:</strong>{" "}
                <a
                  href="tel:988"
                  className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-gold-500 rounded"
                >
                  Call or text 988
                </a>
              </p>
              <p className="text-danger-dark">
                <strong>{CRISIS_RESOURCES.crisisTextLine.name}:</strong> Text HOME to 741741
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Danger Zone"
        description="Permanent actions that cannot be undone."
        danger
      >
        {!showDeleteConfirm ? (
          <div>
            <p className="text-sm text-navy-600 mb-4">
              Deleting your account will permanently remove all your data including your graduation
              checklist, yearbook page, and wins. This cannot be reversed.
            </p>
            <Button
              type="button"
              variant="outline"
              className="border-danger-light text-danger hover:bg-danger-light/20"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete My Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-medium text-danger-dark">
              This will permanently delete your account. Type <strong>DELETE</strong> to confirm.
            </p>
            <Input
              label='Type "DELETE" to confirm'
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              autoComplete="off"
            />
            <div className="flex gap-3 flex-wrap">
              <Button
                type="button"
                variant="outline"
                className="border-danger-light text-danger hover:bg-danger-light/20"
                onClick={() => void handleDeleteAccount()}
                disabled={deleteConfirmText !== "DELETE" || deletingAccount}
                isLoading={deletingAccount}
                loadingText="Deleting…"
              >
                Permanently Delete
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
