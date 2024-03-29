// const output = require("./outputs.json");

// process.env = Object.assign(process.env, Object.values(output)[0]);

module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
