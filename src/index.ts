import "reflect-metadata";
import AWS from "aws-sdk";
import sourceMapSupport from "source-map-support";
import { appConfig } from "./config/config.service";
import { Handlers } from "./handlers-list";
import { RegistrationService } from "./registration/registration.service";
import { LambdaHandlerFactory, PublicFn } from "./@common/lambda-handler.factory";

sourceMapSupport.install();

AWS.config.update({ region: appConfig.region });

const handlers: Record<Handlers, PublicFn> = {
  [Handlers.SignupHandler]: e => new RegistrationService().signUp(e),
  [Handlers.ConfirmRegistrationHandler]: e => new RegistrationService().confirmRegistration(e),
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
