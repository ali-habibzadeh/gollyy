import { DynamoStore } from "@shiftcoders/dynamo-easy";

export default abstract class BaseRepository<T> {
  protected abstract store: DynamoStore<T>;

  public abstract list(): Promise<T[]>;

  public abstract create(...args: unknown[]): Promise<T>;
}
