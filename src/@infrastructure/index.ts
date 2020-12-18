/* eslint-disable no-new */
import { App, CfnOutput, Stack } from "@aws-cdk/core";

import GollyyApi from "./api/graphql-api";
import Registration from "./registeration/registration";
import ScheduledDraw from "./scheduled-draw/draw";
import AppStaticStack from "./static-stack";

export default class AppStack extends Stack {
  public registration = new Registration(this, "AppUserPoolContainer");

  public api = new GollyyApi(this, this.registration.userPool);

  public scheduledDraw = new ScheduledDraw(this, this.api.drawHandler);

  public regionOutput = new CfnOutput(this, "region", { value: this.region });
}

const app = new App();
new AppStaticStack(app, "GollyyLotteryStatic");
new AppStack(app, "GollyyLottery", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
