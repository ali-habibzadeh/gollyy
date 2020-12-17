import { Model, PartitionKey } from "@shiftcoders/dynamo-easy";

import { appConfig } from "../../config/app-config/config.service";

@Model({ tableName: appConfig.drawsTableName })
export class Draw {
  @PartitionKey()
  public id!: string;

  public numbers!: [number, number];

  public ttl!: number;

  public drawDate!: string;
}
