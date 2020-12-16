import { EnvVars } from "./env-vars.enum";

export const appConfigSchema = {
  [EnvVars.region]: { doc: "AWS Region of the app", format: String, default: "", env: "region" },
  [EnvVars.account]: { doc: "AWS accountId", format: String, default: "", env: "account" },
  [EnvVars.userPoolId]: { format: String, default: "", env: "userPoolId" },
  [EnvVars.userPoolClientId]: { format: String, default: "", env: "userPoolClientId" },
  [EnvVars.ticketsTableName]: { format: String, default: "", env: "ticketsTableName" },
};
