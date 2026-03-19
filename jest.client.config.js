const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });
const sharedCoverage = require("./jest.coverage");

/** @type {import('jest').Config} */
module.exports = createJestConfig({
  displayName: "client",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "<rootDir>/src/**/*.test.tsx",
    "<rootDir>/src/lib/__tests__/**/*.test.ts",
    "<rootDir>/src/components/**/__tests__/**/*.test.ts",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/e2e/",
    "/.next/",
    "<rootDir>/src/app/api/__tests__/",
  ],
  ...sharedCoverage,
});
