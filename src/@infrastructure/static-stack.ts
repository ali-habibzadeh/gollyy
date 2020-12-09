import { Vpc } from "@aws-cdk/aws-ec2";
import { HostedZone } from "@aws-cdk/aws-route53";
import { CfnOutput, Stack } from "@aws-cdk/core";
import { infrasConfig } from "./@common/config";

export default class AppStaticStack extends Stack {
  private vpc = new Vpc(this, "GollyyVpc");

  private authDomainName = <const>`auth.${infrasConfig.domainName}`;

  public rootHostedZone = new HostedZone(this, `rootZone`, { zoneName: infrasConfig.domainName });

  public authHostedZone = new HostedZone(this, `authZone`, { zoneName: this.authDomainName });

  public vpcId = new CfnOutput(this, "vpcId", { value: this.vpc.vpcId });

  public rootHostedZoneId = new CfnOutput(this, "rootHostedZoneId", { value: this.rootHostedZone.hostedZoneId });

  public authHostedZoneId = new CfnOutput(this, "authHostedZoneId", { value: this.authHostedZone.hostedZoneId });
}
