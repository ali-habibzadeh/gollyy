/* eslint-disable no-new */
import { App, CfnOutput, Stack } from "@aws-cdk/core";

import GollyApi from "./api/graphql-api";
import Registration from "./registeration/registration";
import AppStaticStack from "./static-stack";

export default class AppStack extends Stack {
  public registration = new Registration(this, "AppUserPoolContainer");

  public api = new GollyApi(this, "GollyyApiContainer", this.registration.userPool);

  public regionOutput = new CfnOutput(this, "region", { value: this.region });
}

const app = new App();
new AppStaticStack(app, "GollyyLotteryStatic");
new AppStack(app, "GollyyLottery", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
