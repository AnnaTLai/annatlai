module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  collectCoverageFrom: [
    "js/animate.js",
    "js/custom.js",
    "js/validate.js"
  ],
  coverageDirectory: "coverage"
};
