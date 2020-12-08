"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const source_map_support_1 = __importDefault(require("source-map-support"));
const config_service_1 = require("./config/config.service");
const handlers_list_1 = require("./handlers-list");
const registration_service_1 = require("./registration/registration.service");
const lambda_handler_factory_1 = require("./@common/lambda-handler.factory");
source_map_support_1.default.install();
aws_sdk_1.default.config.update({ region: config_service_1.appConfig.region });
const handlers = {
    [handlers_list_1.Handlers.RegistrationHandler]: e => new registration_service_1.RegistrationService().signUp(e),
};
module.exports = new lambda_handler_factory_1.LambdaHandlerFactory(handlers).getHandlers();
//# sourceMappingURL=index.js.map