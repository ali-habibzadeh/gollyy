"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfigSchema = void 0;
const env_vars_enum_1 = require("./env-vars.enum");
const isStringAndNotEmpty = (v) => {
    if (typeof v !== "string" || v.length < 1) {
        throw new Error(`required and can not be empty string`);
    }
};
exports.appConfigSchema = {
    [env_vars_enum_1.EnvVars.region]: {
        doc: "AWS Region of the app",
        format: isStringAndNotEmpty,
        default: "",
        env: "region",
    },
    [env_vars_enum_1.EnvVars.account]: {
        doc: "AWS accountId",
        format: isStringAndNotEmpty,
        default: "",
        env: "account",
    },
    [env_vars_enum_1.EnvVars.userPoolId]: {
        format: isStringAndNotEmpty,
        default: "",
        env: "userPoolId",
    },
    [env_vars_enum_1.EnvVars.userPoolClientId]: {
        format: isStringAndNotEmpty,
        default: "",
        env: "userPoolClientId",
    },
};
//# sourceMappingURL=schema.js.map