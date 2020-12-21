export default abstract class BaseRepository<T> {
  public abstract list(args: unknown): Promise<T[]>;

  public abstract create(args: unknown): Promise<T>;
}
