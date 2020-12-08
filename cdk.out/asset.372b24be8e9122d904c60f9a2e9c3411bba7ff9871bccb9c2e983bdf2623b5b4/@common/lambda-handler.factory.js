"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaHandlerFactory = void 0;
class LambdaHandlerFactory {
    constructor(configs) {
        this.configs = configs;
        this.entries = Object.entries(this.configs);
        this.defaultConfig = {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
        };
    }
    getHandlers() {
        return this.entries.reduce((configs, [name, fn]) => ({
            ...configs,
            [name]: this.getHandler(fn),
        }), {});
    }
    getHandler(fn) {
        return async (event, context) => {
            const results = await fn(event, context);
            return {
                ...this.defaultConfig,
                body: JSON.stringify(results),
            };
        };
    }
}
exports.LambdaHandlerFactory = LambdaHandlerFactory;
//# sourceMappingURL=lambda-handler.factory.js.map