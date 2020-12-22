import { Cors, LambdaRestApi } from "@aws-cdk/aws-apigateway";
import { Table } from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";

import { EnvVars } from "../../../config/app-config/env-vars.enum";
import { Handlers } from "../../../handlers-list";
import { LambdaFactory } from "../../@common/lambda.factory";

export default class PaymentWebhook {
  constructor(private scope: Construct, private ticketsTable: Table) {
    this.ticketsTable.grantFullAccess(this.paymentWebhookHandler);
    this.defineApiMethods();
  }

  public paymentWebhookHandler = new LambdaFactory(this.scope, Handlers.paymentWebhook, {
    [EnvVars.ticketsTableName]: this.ticketsTable.tableName,
  }).getLambda();

  public api = new LambdaRestApi(this.scope, `StripeWebhookApi`, {
    handler: this.paymentWebhookHandler,
    proxy: false,
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
    },
  });

  private defineApiMethods(): void {
    this.api.root.addResource("stripe-webhook").addMethod("POST", undefined);
  }
}
