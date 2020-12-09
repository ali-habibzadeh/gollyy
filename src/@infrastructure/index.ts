import { App, Stack, CfnOutput } from "@aws-cdk/core";
import { AppDomains } from "./@common/domains";

import AppUserPool from "./registeration/user-pool";

export default class AppStack extends Stack {
  public regionOutput = new CfnOutput(this, "region", { value: this.region });

  public appUserPool = new AppUserPool(this, "AppUserPoolContainer");

  public appSslCertificate = new AppDomains(this, "AppDomains", this.appUserPool.userPool);
}

const app = new App();
// eslint-disable-next-line no-new
new AppStack(app, "gollyy-lottery");
app.synth();
