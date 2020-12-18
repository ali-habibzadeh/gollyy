import { Rule, Schedule } from "@aws-cdk/aws-events";
import { LambdaFunction } from "@aws-cdk/aws-events-targets";
import { Function as Fn } from "@aws-cdk/aws-lambda";
import { Construct } from "@aws-cdk/core";

export default class ScheduledDraw {
  constructor(private scope: Construct, private drawHandlers: Fn) {}

  public rule = new Rule(this.scope, "ScheduledDraw", {
    schedule: Schedule.cron({ minute: "0", hour: "0", day: "*", month: "*", year: "*" }),
    targets: [new LambdaFunction(this.drawHandlers)],
  });
}
