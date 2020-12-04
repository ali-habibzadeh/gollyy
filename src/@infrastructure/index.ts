import { App, Stack, CfnOutput } from "@aws-cdk/core";

export default class GollyyStack extends Stack {
  public regionOutput = new CfnOutput(this, "region", { value: this.region });
}

const app = new App();
// eslint-disable-next-line no-new
new GollyyStack(app, "gollyy-lottery");
app.synth();
