import { EnvVars } from "./env-vars.enum";

const isStringAndNotEmpty = (v: unknown): asserts v is string => {
  if (typeof v !== "string" || v.length < 1) {
    throw new Error(`required and can not be empty string`);
  }
};

export const appConfigSchema = {
  [EnvVars.region]: {
    doc: "AWS Region of the app",
    format: isStringAndNotEmpty,
    default: "",
    env: "region",
  },
  [EnvVars.account]: {
    doc: "AWS accountId",
    format: isStringAndNotEmpty,
    default: "",
    env: "account",
  },
  [EnvVars.userPoolId]: {
    format: isStringAndNotEmpty,
    default: "",
    env: "userPoolId",
  },
  [EnvVars.userPoolClientId]: {
    format: isStringAndNotEmpty,
    default: "",
    env: "userPoolClientId",
  },
};
