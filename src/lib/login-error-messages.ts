/**
 * User-facing copy for `/login?error=...` (NextAuth + app-specific codes).
 */
export const LOGIN_QUERY_ERROR_MESSAGES: Record<string, string> = {
  NotOnRoster:
    "Your email is not on the approved Class of 2026 roster. If you believe this is an error, contact your counselor Tomeco Dates at tomeco.dates@pgcps.org or 301-808-8880.",
  /** `pages.error` in auth config points here for generic auth failures. */
  true: "Something went wrong with sign-in. Please try again.",
  AccessDenied:
    "Access was denied. Use your @students.pgcps.org or @pgcps.org Google account, or contact your counselor.",
  Configuration: "Sign-in is temporarily unavailable. Please try again later.",
  Verification: "The sign-in link is invalid or has expired.",
  Callback: "Sign-in could not complete. Please try again.",
  OAuthSignin: "Could not start Google sign-in. Please try again.",
  OAuthCallback: "Google sign-in failed. Please try again.",
  OAuthCreateAccount: "Could not create an account from this Google profile.",
  EmailCreateAccount: "Could not create an account with this email.",
  OAuthAccountNotLinked:
    "This Google account is not linked to your profile. Sign in with the method you used when you registered.",
  SessionRequired: "Please sign in to continue.",
};

export const DEFAULT_LOGIN_QUERY_ERROR_MESSAGE = "Something went wrong. Please try again.";

export function getLoginQueryErrorMessage(code: string | null): string | null {
  if (!code) return null;
  return LOGIN_QUERY_ERROR_MESSAGES[code] ?? DEFAULT_LOGIN_QUERY_ERROR_MESSAGE;
}
