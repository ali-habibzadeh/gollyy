"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaFactory = void 0;
const path = __importStar(require("path"));
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
class LambdaFactory {
    constructor(parent, handler, env) {
        this.parent = parent;
        this.handler = handler;
        this.env = env;
        this.defaultSettings = {
            runtime: aws_lambda_1.Runtime.NODEJS_12_X,
            code: aws_lambda_1.Code.fromAsset(path.join(__dirname.substring(0, __dirname.indexOf("dist") + 4))),
            memorySize: 2000,
            timeout: core_1.Duration.minutes(3),
            tracing: aws_lambda_1.Tracing.ACTIVE,
        };
    }
    getLambda() {
        return new aws_lambda_1.Function(this.parent, `Id-${this.handler}`, {
            ...this.defaultSettings,
            functionName: `FnName-${this.handler}`,
            handler: `index.${this.handler}`,
            environment: {
                region: core_1.Stack.of(this.parent).region,
                account: core_1.Stack.of(this.parent).account,
                ...this.env,
            },
        });
    }
}
exports.LambdaFactory = LambdaFactory;
//# sourceMappingURL=lambda.factory.js.map