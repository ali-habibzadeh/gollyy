import { join } from "path";

import { AuthorizationType, GraphqlApi, Schema, UserPoolDefaultAction } from "@aws-cdk/aws-appsync";
import { IUserPool } from "@aws-cdk/aws-cognito";
import { AttributeType, BillingMode, Table } from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";

import { EnvVars } from "../../config/app-config/env-vars.enum";
import { Handlers } from "../../handlers-list";
import { LambdaFactory } from "../@common/lambda.factory";

export default class GollyApi {
  constructor(private scope: Construct, private id: string, private userPool: IUserPool) {
    this.ticketsTable.grantFullAccess(this.apiHandler);
  }

  public api = new GraphqlApi(this.scope, "BusinessApi", {
    name: "GollyyBusinessApi",
    schema: Schema.fromAsset(join(__dirname, "schemas/schema.graphql")),
    xrayEnabled: true,
    authorizationConfig: {
      defaultAuthorization: {
        authorizationType: AuthorizationType.USER_POOL,
        userPoolConfig: { userPool: this.userPool, defaultAction: UserPoolDefaultAction.ALLOW },
      },
    },
  });

  private ticketsTable = new Table(this.scope, "ticketsTable", {
    partitionKey: { name: "id", type: AttributeType.STRING },
    billingMode: BillingMode.PAY_PER_REQUEST,
  });

  private apiHandler = new LambdaFactory(this.scope, Handlers.graphQlApi, {
    [EnvVars.ticketsTableName]: this.ticketsTable.tableName,
  }).getLambda();

  private ds = this.api.addLambdaDataSource("ticketsDatasource", this.apiHandler);

  private ticketQuery = this.ds.createResolver({ typeName: "Query", fieldName: "getTickets" });

  private ticketMutation = this.ds.createResolver({ typeName: "Mutation", fieldName: "createTicket" });
}
