import { AppSyncResolverEvent } from "aws-lambda";

export default class ApiService {
  // eslint-disable-next-line class-methods-use-this
  public async respond(event: AppSyncResolverEvent<unknown>): Promise<unknown> {
    // eslint-disable-next-line no-console
    return JSON.stringify(event);
  }
}
