import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import { UserPool, UserPoolDomain } from "@aws-cdk/aws-cognito";
import { ARecord, RecordTarget } from "@aws-cdk/aws-route53";
import { UserPoolDomainTarget } from "@aws-cdk/aws-route53-targets";
import { Construct, Stack } from "@aws-cdk/core";
import { infrasConfig } from "../@common/config";
import { StaticStackService } from "../@common/static-stack.service";

export class AuthDomain {
  private authDomainName = <const>`auth.${infrasConfig.domainName}`;

  private authHostedZone = StaticStackService.getAuthHostedZoneId(this.scope);

  constructor(private scope: Construct, private id: string, private userPool: UserPool) {}

  private authCert = new DnsValidatedCertificate(this.scope, `${this.id}-auth-domain-certificate`, {
    domainName: this.authDomainName,
    hostedZone: this.authHostedZone,
  });

  public userPoolDomain = new UserPoolDomain(this.scope, `${this.id}-userpool-domain`, {
    userPool: this.userPool,
    customDomain: {
      certificate: {
        certificateArn: this.authCert.certificateArn,
        env: {
          account: Stack.of(this.scope).account,
          region: Stack.of(this.scope).region,
        },
        node: this.scope.node,
        stack: Stack.of(this.scope),
      },
      domainName: this.authDomainName,
    },
  });

  public authDomain = new ARecord(this.scope, `${this.id}-auth-subdomain`, {
    recordName: this.authDomainName,
    zone: this.authHostedZone,
    target: RecordTarget.fromAlias(new UserPoolDomainTarget(this.userPoolDomain)),
  });
}
