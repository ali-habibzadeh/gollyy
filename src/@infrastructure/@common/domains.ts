import { Certificate, CertificateValidation } from "@aws-cdk/aws-certificatemanager";
import { UserPool, UserPoolDomain } from "@aws-cdk/aws-cognito";
import { HostedZone, ARecord, RecordTarget } from "@aws-cdk/aws-route53";
import { UserPoolDomainTarget } from "@aws-cdk/aws-route53-targets";
import { Construct, Stack } from "@aws-cdk/core";
import { infrasConfig } from "./config";

export class AppDomains {
  constructor(private scope: Construct, private id: string, private userPool: UserPool) {}

  public hostedZone = new HostedZone(this.scope, `${this.id}-hostedZone`, {
    zoneName: infrasConfig.domainName,
  });

  public certificate = new Certificate(this.scope, `${this.id}-certificate`, {
    domainName: infrasConfig.domainName,
    validation: CertificateValidation.fromDns(this.hostedZone),
  });

  public userPoolDomain = new UserPoolDomain(this.scope, `${this.id}-userpool-domain`, {
    userPool: this.userPool,
    customDomain: {
      certificate: {
        certificateArn: this.certificate.certificateArn,
        env: {
          account: Stack.of(this.scope).account,
          region: Stack.of(this.scope).region,
        },
        node: this.scope.node,
        stack: Stack.of(this.scope),
      },
      domainName: infrasConfig.domainName,
    },
  });

  public authDomain = new ARecord(this.scope, `${this.id}-auth-subdomain`, {
    recordName: "auth-subdomain",
    zone: this.hostedZone,
    target: RecordTarget.fromAlias(new UserPoolDomainTarget(this.userPoolDomain)),
  });
}
