import { App, Stack, CfnOutput } from "@aws-cdk/core";

import AppUserPool from "./registeration/user-pool";

export default class AppStack extends Stack {
  public regionOutput = new CfnOutput(this, "region", { value: this.region });

  public appUserPool = new AppUserPool(this, "AppUserPoolContainer");
}

const app = new App();
// eslint-disable-next-line no-new
new AppStack(app, "gollyy-lottery");
app.synth();
