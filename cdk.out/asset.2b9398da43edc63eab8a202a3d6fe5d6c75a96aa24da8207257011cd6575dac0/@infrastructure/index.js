"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const user_pool_1 = __importDefault(require("./registeration/user-pool"));
class AppStack extends core_1.Stack {
    constructor() {
        super(...arguments);
        this.regionOutput = new core_1.CfnOutput(this, "region", { value: this.region });
        this.appUserPool = new user_pool_1.default(this, "AppUserPoolContainer");
    }
}
exports.default = AppStack;
const app = new core_1.App();
// eslint-disable-next-line no-new
new AppStack(app, "gollyy-lottery");
app.synth();
//# sourceMappingURL=index.js.map