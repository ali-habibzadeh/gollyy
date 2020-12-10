import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import * as Cognito from "@aws-cdk/aws-cognito";
import { UserPoolDomain } from "@aws-cdk/aws-cognito";
import { Construct, Duration, Stack } from "@aws-cdk/core";
import { EnvVars } from "../../config/env-vars.enum";
import { Handlers } from "../../handlers-list";
import { infrasConfig } from "../@common/config";
import { LambdaFactory } from "../@common/lambda.factory";
import { StaticStackService } from "../@common/static-stack.service";

export default class AppUserPool {
  constructor(private scope: Construct, private id: string) {}

  private userVerification = {
    emailSubject: "Verify your email for Gollyy!",
    emailBody: "Your Gollyy verification code is {####}",
    emailStyle: Cognito.VerificationEmailStyle.CODE,
    smsMessage: "Your Gollyy verification code is {####}",
  };

  private userInvitation = {
    emailSubject: "You are invited to join Gollyy!",
    emailBody: "Hello {username}, you have been invited to join Gollyy! Your temporary password is {####}",
    smsMessage: "Hello {username}, Your temporary Gollyy password is {####}",
  };

  private passwordPolicy = {
    minLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireDigits: true,
    requireSymbols: true,
    tempPasswordValidity: Duration.days(3),
  };

  public userPool = new Cognito.UserPool(this.scope, `${this.id}-userpool`, {
    userPoolName: "AppUserPool",
    selfSignUpEnabled: true,
    userVerification: this.userVerification,
    userInvitation: this.userInvitation,
    signInAliases: { username: true, email: true, phone: true },
    accountRecovery: Cognito.AccountRecovery.EMAIL_ONLY,
    mfa: Cognito.Mfa.REQUIRED,
    mfaSecondFactor: { sms: true, otp: true },
    passwordPolicy: this.passwordPolicy,
    standardAttributes: {
      email: { mutable: true, required: true },
      phoneNumber: { mutable: true, required: true },
    },
    emailSettings: {
      replyTo: "support@gollyy.com",
    },
  });

  private authHostedZone = StaticStackService.getAuthHostedZoneId(this.scope);

  private authCert = new DnsValidatedCertificate(this.scope, `${this.id}-auth-domain-certificate`, {
    domainName: infrasConfig.authDomainName,
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
      domainName: infrasConfig.authDomainName,
    },
  });

  public userPoolClient = new Cognito.UserPoolClient(this.scope, `${this.id}-userpool-client`, {
    userPool: this.userPool,
    generateSecret: false,
  });

  private ConigtoHandlers = [Handlers.SignupHandler];

  public handlers = this.ConigtoHandlers.map(handler =>
    new LambdaFactory(this.scope, handler, {
      [EnvVars.userPoolId]: this.userPool.userPoolId,
      [EnvVars.userPoolClientId]: this.userPoolClient.userPoolClientId,
    }).getLambda(),
  );
}
