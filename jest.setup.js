require("@testing-library/jest-dom");

if (process.env.DATABASE_URL === undefined) {
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:5432/test";
}
if (process.env.NEXTAUTH_URL === undefined) {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}
if (process.env.NEXTAUTH_SECRET === undefined) {
  process.env.NEXTAUTH_SECRET = "jest-secret-jest-secret-jest-secret-01";
}

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

jest.mock("next-auth/react", () => {
  const React = require("react");
  return {
    useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
    SessionProvider: ({ children }) =>
      React.createElement(React.Fragment, null, children),
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
});
