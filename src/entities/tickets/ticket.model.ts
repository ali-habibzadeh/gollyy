import { Model, PartitionKey } from "@shiftcoders/dynamo-easy";

import { appConfig } from "../../config/app-config/config.service";

@Model({ tableName: appConfig.ticketsTableName })
export class Ticket {
  @PartitionKey()
  public id!: string;

  public username?: string;

  public numbers!: [number, number];

  public ttl!: number;

  public drawDate!: string;

  public won?: boolean = false;
}
