module.exports = {
  testEnvironment: "node",
  testTimeout: 15000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/config/db.js",
    "!src/seed/**",
    "!src/tests/**"
  ],
  coverageThreshold: {
    global: {
      branches: 45,
      functions: 80,
      lines: 85,
      statements: 84
    }
  }
};
