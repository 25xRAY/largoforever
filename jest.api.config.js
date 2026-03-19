const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });
const sharedCoverage = require("./jest.coverage");

/** @type {import('jest').Config} */
module.exports = createJestConfig({
  displayName: "api",
  coverageProvider: "v8",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.node.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/src/app/api/__tests__/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/", "/.next/"],
  ...sharedCoverage,
});
