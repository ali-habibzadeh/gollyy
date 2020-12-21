import "reflect-metadata";
import "./config/amplify/amplify.config";

import AWS from "aws-sdk";
import sourceMapSupport from "source-map-support";

import { LambdaHandlerFactory, PublicFn } from "./@common/lambda-handler.factory";
import ApiService from "./api/api.service";
import { appConfig } from "./config/app-config/config.service";
import { Handlers } from "./handlers-list";
import { LotteryService } from "./lottery/lottery.service";
import PaymentService from "./payment/payment.service";
import { RegistrationService } from "./registration/registration.service";

sourceMapSupport.install();

AWS.config.update({ region: appConfig.region });

const handlers: Record<Handlers, PublicFn> = {
  [Handlers.signUp]: e => new RegistrationService().signUp(e),
  [Handlers.confirmSignUp]: e => new RegistrationService().confirmSignUp(e),
  [Handlers.resendSignUp]: e => new RegistrationService().resendSignUp(e),
  [Handlers.signIn]: e => new RegistrationService().signIn(e),
  [Handlers.confirmSignIn]: e => new RegistrationService().confirmSignIn(e),
  [Handlers.graphQlApi]: e => new ApiService().respond(e),
  [Handlers.runDraw]: () => new LotteryService().carryOutDraw(),
  [Handlers.createPaymentIntent]: () => new PaymentService().createIntent(),
};

module.exports = new LambdaHandlerFactory(handlers).getHandlers();
