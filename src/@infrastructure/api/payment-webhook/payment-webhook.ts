import { LambdaIntegration, LambdaRestApi, PassthroughBehavior } from "@aws-cdk/aws-apigateway";
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
  });

  private defineApiMethods(): void {
    this.api.root.addResource("stripe-webhook").addMethod(
      "POST",
      new LambdaIntegration(this.paymentWebhookHandler, {
        proxy: false,
        requestTemplates: {
          "application/json": `
          #set($allParams = $input.params())
          {
          "raw": "$input.body",
          "body-json" : $input.json('$'),
          "params" : {
          #foreach($type in $allParams.keySet())
              #set($params = $allParams.get($type))
          "$type" : {
              #foreach($paramName in $params.keySet())
              "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
                  #if($foreach.hasNext),#end
              #end
          }
              #if($foreach.hasNext),#end
          #end
          },
          "stage-variables" : {
          #foreach($key in $stageVariables.keySet())
          "$key" : "$util.escapeJavaScript($stageVariables.get($key))"
              #if($foreach.hasNext),#end
          #end
          },
          "context" : {
              "account-id" : "$context.identity.accountId",
              "api-id" : "$context.apiId",
              "api-key" : "$context.identity.apiKey",
              "authorizer-principal-id" : "$context.authorizer.principalId",
              "caller" : "$context.identity.caller",
              "cognito-authentication-provider" : "$context.identity.cognitoAuthenticationProvider",
              "cognito-authentication-type" : "$context.identity.cognitoAuthenticationType",
              "cognito-identity-id" : "$context.identity.cognitoIdentityId",
              "cognito-identity-pool-id" : "$context.identity.cognitoIdentityPoolId",
              "http-method" : "$context.httpMethod",
              "stage" : "$context.stage",
              "source-ip" : "$context.identity.sourceIp",
              "user" : "$context.identity.user",
              "user-agent" : "$context.identity.userAgent",
              "user-arn" : "$context.identity.userArn",
              "request-id" : "$context.requestId",
              "resource-id" : "$context.resourceId",
              "resource-path" : "$context.resourcePath"
              }
          }
          `,
        },
        passthroughBehavior: PassthroughBehavior.NEVER,
      }),
    );
  }
}
