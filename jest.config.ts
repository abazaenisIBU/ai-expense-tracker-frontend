import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest", // Use babel-jest for all files
  },
  transformIgnorePatterns: ["/node_modules/(?!axios)"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy", // Mock CSS/SCSS imports
  },
  testMatch: ["**/__tests__/**/*.(spec|test).ts?(x)"], // Match test files
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // Add if not present
};

export default config;
