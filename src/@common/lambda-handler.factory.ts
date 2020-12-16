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

  public getHandlers(): ILambdaHandlers {
    return this.entries.reduce(
      (configs, [name, fn]) => ({
        ...configs,
        [name]: (event, context) => fn(event, context),
      }),
      <ILambdaHandlers>{},
    );
  }
}
