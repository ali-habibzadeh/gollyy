import { Construct } from "@aws-cdk/core";

import { EnvVars } from "../../../config/app-config/env-vars.enum";
import { Handlers } from "../../../handlers-list";
import { LambdaFactory } from "../../@common/lambda.factory";

export default class AppPayment {
  constructor(private scope: Construct) {}

  public apiHandler = new LambdaFactory(this.scope, Handlers.createPaymentIntent, {
    [EnvVars.stripeSecretKey]: this.scope.node.tryGetContext("STRIPE_SECRET_KEY"),
  }).getLambda();
}
