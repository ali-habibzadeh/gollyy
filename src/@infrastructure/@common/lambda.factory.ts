import * as path from "path";

import { Code, Function as Fn, Runtime, Tracing } from "@aws-cdk/aws-lambda";
import { Construct, Duration, Stack } from "@aws-cdk/core";

import { Handlers } from "../../handlers-list";

export class LambdaFactory {
  private defaultSettings = {
    runtime: Runtime.NODEJS_12_X,
    code: Code.fromAsset(path.join(__dirname.substring(0, __dirname.indexOf("dist") + 4))),
    memorySize: 2000,
    timeout: Duration.seconds(2),
    tracing: Tracing.ACTIVE,
  };

  constructor(private parent: Construct, private handler: Handlers, private env?: Record<string, string>) {}

  public getLambda(): Fn {
    return new Fn(this.parent, `Id-${this.handler}`, {
      ...this.defaultSettings,
      functionName: `FnName-${this.handler}`,
      handler: `index.${this.handler}`,
      environment: {
        region: Stack.of(this.parent).region,
        account: Stack.of(this.parent).account,
        ...this.env,
      },
    });
  }
}
