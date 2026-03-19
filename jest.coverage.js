/** Shared coverage targets for client + API Jest projects. */
module.exports = {
  collectCoverageFrom: [
    "src/lib/utils.ts",
    "src/lib/cache.ts",
    "src/lib/analytics.ts",
    "src/lib/image-processing.ts",
    "src/lib/static-generator.ts",
    "src/components/ui/Button.tsx",
    "src/components/dashboard/ReadinessMeter.tsx",
  ],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
};
