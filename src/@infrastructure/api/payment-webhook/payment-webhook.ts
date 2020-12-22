import { LambdaIntegration, LambdaRestApi } from "@aws-cdk/aws-apigateway";
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
    binaryMediaTypes: ["application/json"],
  });

  private integration = new LambdaIntegration(this.paymentWebhookHandler, {
    requestTemplates: {
      "application/json": `{
      "body": $input.json('$'),
      "rawBody": "$util.escapeJavaScript($util.base64Decode($input.body))",
      "headers": {
        #foreach($header in $input.params().header.keySet())
        "$header": "$util.escapeJavaScript($input.params().header.get($header))" #if($foreach.hasNext),#end

        #end
      },
      "method": "$context.httpMethod",
      "params": {
        #foreach($param in $input.params().path.keySet())
        "$param": "$util.escapeJavaScript($input.params().path.get($param))" #if($foreach.hasNext),#end
    
        #end
      },
      "query": {
        #foreach($queryParam in $input.params().querystring.keySet())
        "$queryParam": "$util.escapeJavaScript($input.params().querystring.get($queryParam))" #if($foreach.hasNext),#end
    
        #end
      }  
    }`,
    },
  });

  private defineApiMethods(): void {
    this.api.root.addResource("stripe-webhook").addMethod("POST", this.integration);
  }
}
