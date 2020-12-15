import { HostedZone, IHostedZone } from "@aws-cdk/aws-route53";
import { Construct, Fn } from "@aws-cdk/core";

import { infrasConfig } from "./config";

export class StaticStackService {
  public static getRootHostedZoneId(scope: Construct): IHostedZone {
    const hostedZoneId = Fn.importValue("rootHostedZoneId");
    return HostedZone.fromHostedZoneAttributes(scope, `${scope.node.id}-rootHostedZoneId`, {
      hostedZoneId,
      zoneName: infrasConfig.domainName,
    });
  }

  public static getAuthDomainCertificateArn(): string {
    return Fn.importValue("authDomainCertificateArn");
  }

  public static getAuthHostedZoneId(scope: Construct): IHostedZone {
    const hostedZoneId = Fn.importValue("authHostedZoneId");
    return HostedZone.fromHostedZoneAttributes(scope, `${scope.node.id}-authHostedZoneId`, {
      hostedZoneId,
      zoneName: `auth.${infrasConfig.domainName}`,
    });
  }
}
