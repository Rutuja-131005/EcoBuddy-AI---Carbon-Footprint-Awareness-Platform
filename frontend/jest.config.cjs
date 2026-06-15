module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/src/tests/mocks/styleMock.js",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg)$": "<rootDir>/src/tests/mocks/fileMock.js"
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  collectCoverageFrom: [
    "src/components/**/*.{js,jsx}",
    "src/pages/**/*.{js,jsx}",
    "src/hooks/**/*.{js,jsx}",
    "src/services/api.js",
    "src/utils/formatters.js",
    "!src/main.jsx"
  ],
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 55,
      lines: 70,
      statements: 68
    }
  }
};
