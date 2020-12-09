// import { Construct, Fn, Stack } from "@aws-cdk/core";
import { Construct } from "@aws-cdk/core";
import { HostedZone, IHostedZone } from "@aws-cdk/aws-route53";
// import { IVpc, Vpc } from "@aws-cdk/aws-ec2";
import { infrasConfig } from "./config";

export class StaticStackService {
  //   public static getVpcId(scope: Construct): IVpc {
  //     const vpcId = Fn.importValue(`GollyyLotteryStatic.vpcId`);
  //     return Vpc.fromLookup(scope, `${scope.node.id}-vpcId`, { vpcId });
  //   }

  public static getRootHostedZoneId(scope: Construct): IHostedZone {
    return HostedZone.fromLookup(scope, `${scope.node.id}-rootHostedZoneId`, {
      domainName: infrasConfig.domainName,
    });
  }

  public static getAuthHostedZoneId(scope: Construct): IHostedZone {
    return HostedZone.fromLookup(scope, `${scope.node.id}-authHostedZoneId`, {
      domainName: `auth.${infrasConfig.domainName}`,
    });
  }
}
