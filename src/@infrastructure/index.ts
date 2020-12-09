/* eslint-disable no-new */
import { App, Stack, CfnOutput } from "@aws-cdk/core";

import AppUserPool from "./registeration/user-pool";
import AppStaticStack from "./static-stack";

export default class AppStack extends Stack {
  public regionOutput = new CfnOutput(this, "region", { value: this.region });

  public appUserPool = new AppUserPool(this, "AppUserPoolContainer");
}

const app = new App();
new AppStaticStack(app, "GollyyLotteryStatic");
new AppStack(app, "GollyyLottery", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
