import { AppSyncResolverEvent } from "aws-lambda";

import { DynamoStore } from "@shiftcoders/dynamo-easy";

export default abstract class BaseRepository<T> {
  protected abstract store: DynamoStore<T>;

  public abstract list(event: AppSyncResolverEvent<T>): Promise<T[]>;

  public abstract create(event: AppSyncResolverEvent<T>): Promise<T>;
}
