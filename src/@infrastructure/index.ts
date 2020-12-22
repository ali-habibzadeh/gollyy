/* eslint-disable no-new */
import { App, CfnOutput, Stack } from "@aws-cdk/core";

import GollyyApi from "./api/graphql-api";
import PaymentWebhook from "./api/payment-webhook/payment-webhook";
import Registration from "./registeration/registration";
import ScheduledDraw from "./scheduled-draw/scheduled-draw";
import AppStaticStack from "./static-stack";

export default class AppStack extends Stack {
  public registration = new Registration(this, "AppUserPoolContainer");

  public api = new GollyyApi(this, this.registration.userPool);

  public paymentWebhook = new PaymentWebhook(this, this.api.entityTables.ticketsTable);

  public scheduledDraw = new ScheduledDraw(this, this.api.drawHandler);

  public regionOutput = new CfnOutput(this, "region", { value: this.region });

  public webhookOutput = new CfnOutput(this, "stripeWebhook", { value: this.paymentWebhook.api.url });
}

const app = new App();
new AppStaticStack(app, "GollyyLotteryStatic");
new AppStack(app, "GollyyLottery", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
