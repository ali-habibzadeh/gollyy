import { AccountRecovery, Mfa, UserPool, UserPoolClient, UserPoolDomain, VerificationEmailStyle } from "@aws-cdk/aws-cognito";
import { Construct, Duration } from "@aws-cdk/core";

import { EnvVars } from "../../config/app-config/env-vars.enum";
import { Handlers } from "../../handlers-list";
import { LambdaFactory } from "../@common/lambda.factory";

export default class Registration {
  constructor(private scope: Construct, private id: string) {
    this.createLambdas();
  }

  private userVerification = {
    emailSubject: "Verify your email for Gollyy!",
    emailBody: "Your Gollyy verification code is {####}",
    emailStyle: VerificationEmailStyle.CODE,
    smsMessage: "Your Gollyy verification code is {####}",
  };

  private userInvitation = {
    emailSubject: "You are invited to join Gollyy!",
    emailBody: "Hi {username}, You have been invited to join Gollyy! Your temporary password is {####}",
    smsMessage: "Hi {username}, Your temporary Gollyy password is {####}",
  };

  private passwordPolicy = {
    minLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireDigits: true,
    requireSymbols: true,
    tempPasswordValidity: Duration.days(3),
  };

  public userPool = new UserPool(this.scope, `${this.id}-userpool`, {
    userPoolName: "AppUserPool",
    selfSignUpEnabled: true,
    userVerification: this.userVerification,
    userInvitation: this.userInvitation,
    signInAliases: { username: true, email: true, phone: true },
    accountRecovery: AccountRecovery.EMAIL_ONLY,
    mfa: Mfa.REQUIRED,
    mfaSecondFactor: { sms: true, otp: true },
    passwordPolicy: this.passwordPolicy,
    standardAttributes: {
      email: { mutable: true, required: true },
      phoneNumber: { mutable: true, required: true },
      givenName: { mutable: false, required: true },
      familyName: { mutable: false, required: true },
      address: { mutable: false, required: true },
      birthdate: { mutable: false, required: true },
    },
    emailSettings: {
      replyTo: "support@gollyy.com",
    },
  });

  public userPoolDomain = new UserPoolDomain(this.scope, `${this.id}-userpool-domain`, {
    userPool: this.userPool,
    cognitoDomain: { domainPrefix: "reg" },
  });

  public userPoolClient = new UserPoolClient(this.scope, `${this.id}-userpool-client`, {
    userPool: this.userPool,
    generateSecret: false,
  });

  private createLambdas(): void {
    const env = {
      [EnvVars.userPoolId]: this.userPool.userPoolId,
      [EnvVars.userPoolClientId]: this.userPoolClient.userPoolClientId,
    };
    [
      Handlers.signUp,
      Handlers.confirmSignUp,
      Handlers.resendSignUp,
      Handlers.signIn,
      Handlers.confirmSignIn,
    ].forEach(handler => new LambdaFactory(this.scope, handler, env).getLambda());
  }
}
