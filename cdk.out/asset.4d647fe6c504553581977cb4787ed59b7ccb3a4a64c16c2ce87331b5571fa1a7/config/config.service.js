"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const convict_1 = __importDefault(require("convict"));
const schema_1 = require("./schema");
class ConfigService {
    constructor() {
        this.config = convict_1.default(schema_1.appConfigSchema);
        this.environment = this.config.getProperties();
        this.config.validate({ allowed: "strict" });
    }
    static getInstance() {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }
}
exports.appConfig = ConfigService.getInstance().environment;
//# sourceMappingURL=config.service.js.map