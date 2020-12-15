import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import { HostedZone } from "@aws-cdk/aws-route53";
import { CfnOutput, Stack } from "@aws-cdk/core";

import { infrasConfig } from "./@common/config";

export default class AppStaticStack extends Stack {
  public rootHostedZone = new HostedZone(this, `rootZone`, { zoneName: infrasConfig.domainName });

  public authHostedZone = new HostedZone(this, `authZone`, { zoneName: infrasConfig.authDomainName });

  public authCert = new DnsValidatedCertificate(this, `authDomainCertificate`, {
    domainName: infrasConfig.authDomainName,
    hostedZone: this.authHostedZone,
  });

  public authDomainCertificateArn = new CfnOutput(this, "authDomainCertificateArn", {
    value: this.authCert.certificateArn,
    exportName: "authDomainCertificateArn",
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
