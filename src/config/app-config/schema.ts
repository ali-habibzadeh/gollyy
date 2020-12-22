import { EnvVars } from "./env-vars.enum";

export const appConfigSchema = {
  [EnvVars.region]: { format: String, default: "", env: "region" },
  [EnvVars.account]: { format: String, default: "", env: "account" },
  [EnvVars.userPoolId]: { format: String, default: "", env: "userPoolId" },
  [EnvVars.userPoolClientId]: { format: String, default: "", env: "userPoolClientId" },
  [EnvVars.ticketsTableName]: { format: String, default: "", env: "ticketsTableName" },
  [EnvVars.drawsTableName]: { format: String, default: "", env: "drawsTableName" },
  [EnvVars.dataRetentionDays]: { format: Number, default: 7, env: "dataRetentionDays" },
  [EnvVars.ticketPrice]: { format: Number, default: 5, env: "ticketPrice" },
  [EnvVars.ticketCurrency]: { format: String, default: "GBP", env: "ticketCurrency" },
  [EnvVars.stripePublishableKey]: { format: String, default: "", env: "stripePublishableKey" },
  [EnvVars.stripeSecretKey]: { format: String, default: "", env: "stripeSecretKey" },
  [EnvVars.stripeSigningSecret]: { format: String, default: "", env: "stripeSigningSecret" },
};
