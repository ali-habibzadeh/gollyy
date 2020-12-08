import { UserPool, VerificationEmailStyle, Mfa, UserPoolClient, AccountRecovery } from "@aws-cdk/aws-cognito";
import { Construct, Duration } from "@aws-cdk/core";
import { EnvVars } from "../../config/env-vars.enum";
import { Handlers } from "../../handlers-list";
import { LambdaFactory } from "../@common/lambda.factory";

export default class AppUserPool {
  constructor(private scope: Construct, private id: string) {}

  private userVerification = {
    emailSubject: "Verify your email for our awesome app!",
    emailBody: "Hello {username}, Your Gollyy verification code is {####}",
    emailStyle: VerificationEmailStyle.CODE,
    smsMessage: "Hello {username}, Your Gollyy verification code is {####}",
  };

  private userInvitation = {
    emailSubject: "You are invited to join Gollyy!",
    emailBody: "Hello {username}, you have been invited to join Gollyy! Your temporary password is {####}",
    smsMessage: "Hello {username}, Your temporary Gollyy password is {####}",
  };

  private signInAliases = { username: true, email: true, phoneNumber: true };

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
    signInAliases: this.signInAliases,
    accountRecovery: AccountRecovery.EMAIL_ONLY,
    mfa: Mfa.REQUIRED,
    mfaSecondFactor: { sms: true, otp: true },
    passwordPolicy: this.passwordPolicy,
  });

  public userPoolClient = new UserPoolClient(this.scope, `${this.id}-userpool-client`, {
    userPool: this.userPool,
    generateSecret: false,
  });

  public handler = new LambdaFactory(this.scope, Handlers.RegistrationHandler, {
    [EnvVars.userPoolId]: this.userPool.userPoolId,
    [EnvVars.userPoolClientId]: this.userPoolClient.userPoolClientId,
  }).getLambda();
}
