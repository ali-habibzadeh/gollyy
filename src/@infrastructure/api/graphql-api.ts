import { join } from "path";

import { AuthorizationType, GraphqlApi, Schema, UserPoolDefaultAction } from "@aws-cdk/aws-appsync";
import { IUserPool } from "@aws-cdk/aws-cognito";
import { Construct } from "@aws-cdk/core";

import { EnvVars } from "../../config/app-config/env-vars.enum";
import { allResolvers } from "../../entities/resolver-fields.enum";
import { Handlers } from "../../handlers-list";
import { LambdaFactory } from "../@common/lambda.factory";
import EntityTables from "./entity-tables/entity-tables";

export default class GollyyApi {
  constructor(private scope: Construct, private userPool: IUserPool) {
    this.configureTables();
    this.createAllResolvers();
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

  private entityTables = new EntityTables(this.scope);

  private apiHandler = new LambdaFactory(this.scope, Handlers.graphQlApi, {
    [EnvVars.ticketsTableName]: this.entityTables.ticketsTable.tableName,
    [EnvVars.drawsTableName]: this.entityTables.drawsTable.tableName,
  }).getLambda();

  private configureTables(): void {
    this.entityTables.ticketsTable.grantFullAccess(this.apiHandler);
  }

  private createAllResolvers(): void {
    const ds = this.api.addLambdaDataSource("ticketsDatasource", this.apiHandler);
    allResolvers.forEach(({ typeName, fieldName }) => {
      ds.createResolver({ typeName, fieldName });
    });
  }
}
