import { Vpc } from "@aws-cdk/aws-ec2";
import { HostedZone, ZoneDelegationRecord } from "@aws-cdk/aws-route53";
import { CfnOutput, Stack } from "@aws-cdk/core";
import { infrasConfig } from "./@common/config";

export default class AppStaticStack extends Stack {
  private vpc = new Vpc(this, "GollyyVpc");

  public rootHostedZone = new HostedZone(this, `rootZone`, { zoneName: infrasConfig.domainName });

  public authHostedZone = new HostedZone(this, `authZone`, { zoneName: infrasConfig.authDomainName });

  public authDnsRecord = new ZoneDelegationRecord(this, "authDnsRecord", {
    nameServers: this.authHostedZone.hostedZoneNameServers ?? [""],
    zone: this.rootHostedZone,
    recordName: infrasConfig.authDomainName,
  });

  public vpcId = new CfnOutput(this, "vpcId", {
    value: this.vpc.vpcId,
    exportName: "vpcId",
  });

  public rootHostedZoneId = new CfnOutput(this, "rootHostedZoneId", {
    value: this.rootHostedZone.hostedZoneId,
    exportName: "rootHostedZoneId",
  });

  public authHostedZoneId = new CfnOutput(this, "authHostedZoneId", {
    value: this.authHostedZone.hostedZoneId,
    exportName: "authHostedZoneId",
  });
}
