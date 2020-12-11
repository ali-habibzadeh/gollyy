import "reflect-metadata";
import "./config/amplify/amplify.config";

import AWS from "aws-sdk";
import sourceMapSupport from "source-map-support";

import { LambdaHandlerFactory, PublicFn } from "./@common/lambda-handler.factory";
import { appConfig } from "./config/app-config/config.service";
import { Handlers } from "./handlers-list";
import { RegistrationService } from "./registration/registration.service";

sourceMapSupport.install();

AWS.config.update({ region: appConfig.region });

const handlers: Record<Handlers, PublicFn> = {
  [Handlers.SignupHandler]: e => new RegistrationService().signUp(e),
  [Handlers.ConfirmSignUpHandler]: e => new RegistrationService().confirmSignUp(e),
  [Handlers.ResendSignUpHandler]: e => new RegistrationService().resendSignUp(e),
  [Handlers.AuthenticateUser]: e => new RegistrationService().authenticateUser(e),
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
