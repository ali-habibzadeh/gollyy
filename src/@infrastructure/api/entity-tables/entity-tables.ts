import { AttributeType, BillingMode, Table, TableEncryption, TableProps } from "@aws-cdk/aws-dynamodb";
import { Construct } from "@aws-cdk/core";

export default class EntityTables {
  constructor(private scope: Construct) {}

  private tableProps: TableProps = {
    partitionKey: { name: "id", type: AttributeType.STRING },
    timeToLiveAttribute: "ttl",
    billingMode: BillingMode.PAY_PER_REQUEST,
    encryption: TableEncryption.AWS_MANAGED,
  };

  public ticketsTable = new Table(this.scope, "ticketsTable", this.tableProps);

  public drawsTable = new Table(this.scope, "drawsTable", this.tableProps);
}
