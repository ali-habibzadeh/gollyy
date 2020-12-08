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
    return this.entries.reduce((configs, [name, fn]) => {
      return {
        ...configs,
        [name]: this.getHandler(fn),
      };
    }, {});
  }

  private getHandler(fn: PublicFn): AWSLambda.Handler {
    return async (event, context): Promise<unknown> => {
      const results = await fn(event, context);
      return {
        ...this.defaultConfig,
        body: JSON.stringify(results),
      };
    };
  }
}
