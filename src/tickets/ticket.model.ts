import { DynamoStore, Model, PartitionKey } from "@shiftcoders/dynamo-easy";

import { appConfig } from "../config/app-config/config.service";

@Model({ tableName: appConfig.ticketsTableName })
export class Ticket {
  @PartitionKey()
  public id!: string;

  public numbers!: [number, number];

  public createdAt!: Date;
}

export const ticketStore = new DynamoStore(Ticket);
