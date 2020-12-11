// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PublicFn = (e: any, c?: AWSLambda.Context) => Promise<unknown>;

export interface ILambdaHandlerFactoryConfig {
  [key: string]: PublicFn;
}

export interface ILambdaHandlers {
  [key: string]: AWSLambda.Handler;
}

export class LambdaHandlerFactory {
  private entries = Object.entries(this.configs);

  constructor(private configs: ILambdaHandlerFactoryConfig) {}

  private defaultConfig = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
  };

  public getHandlers(): ILambdaHandlers {
    return this.entries.reduce((configs, [name, fn]) => ({ ...configs, [name]: this.getHandler(fn) }), {});
  }

  private getHandler(fn: PublicFn): AWSLambda.Handler {
    return async (event, context): Promise<unknown> => {
      try {
        const body = await fn(event, context);
        return {
          ...this.defaultConfig,
          body,
        };
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(e));
        throw e;
      }
    };
  }
}
