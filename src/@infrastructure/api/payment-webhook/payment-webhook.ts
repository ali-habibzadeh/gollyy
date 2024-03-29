import { LambdaRestApi } from "@aws-cdk/aws-apigateway";
import { Table } from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";

import { EnvVars } from "../../../config/app-config/env-vars.enum";
import { Handlers } from "../../../handlers-list";
import { LambdaFactory } from "../../@common/lambda.factory";

export default class PaymentWebhook {
  constructor(private scope: Construct, private ticketsTable: Table) {
    this.ticketsTable.grantFullAccess(this.paymentWebhookHandler);
    this.api.root.addResource("stripe-webhook").addMethod("POST");
  }

  public paymentWebhookHandler = new LambdaFactory(this.scope, Handlers.paymentWebhook, {
    [EnvVars.ticketsTableName]: this.ticketsTable.tableName,
    [EnvVars.stripeSigningSecret]: this.scope.node.tryGetContext(EnvVars.stripeSigningSecret),
  }).getLambda();

  public api = new LambdaRestApi(this.scope, `StripeWebhookApi`, {
    proxy: false,
    handler: this.paymentWebhookHandler,
  });
}
