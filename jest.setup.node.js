if (process.env.DATABASE_URL === undefined) {
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:5432/test";
}
if (process.env.NEXTAUTH_URL === undefined) {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}
if (process.env.NEXTAUTH_SECRET === undefined) {
  process.env.NEXTAUTH_SECRET = "jest-secret-jest-secret-jest-secret-01";
}
