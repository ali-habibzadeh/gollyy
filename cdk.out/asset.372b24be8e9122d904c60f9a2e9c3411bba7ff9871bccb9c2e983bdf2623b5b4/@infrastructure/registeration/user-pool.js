"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cognito_1 = require("@aws-cdk/aws-cognito");
const core_1 = require("@aws-cdk/core");
const env_vars_enum_1 = require("../../config/env-vars.enum");
const handlers_list_1 = require("../../handlers-list");
const lambda_factory_1 = require("../@common/lambda.factory");
class AppUserPool {
    constructor(scope, id) {
        this.scope = scope;
        this.id = id;
        this.userVerification = {
            emailSubject: "Verify your email for our awesome app!",
            emailBody: "Hello {username}, Your Gollyy verification code is {####}",
            emailStyle: aws_cognito_1.VerificationEmailStyle.CODE,
            smsMessage: "Hello {username}, Your Gollyy verification code is {####}",
        };
        this.userInvitation = {
            emailSubject: "You are invited to join Gollyy!",
            emailBody: "Hello {username}, you have been invited to join Gollyy! Your temporary password is {####}",
            smsMessage: "Hello {username}, Your temporary Gollyy password is {####}",
        };
        this.signInAliases = { username: true, email: true, phone: true };
        this.passwordPolicy = {
            minLength: 12,
            requireLowercase: true,
            requireUppercase: true,
            requireDigits: true,
            requireSymbols: true,
            tempPasswordValidity: core_1.Duration.days(3),
        };
        this.userPool = new aws_cognito_1.UserPool(this.scope, `${this.id}-userpool`, {
            userPoolName: "AppUserPool",
            selfSignUpEnabled: true,
            userVerification: this.userVerification,
            userInvitation: this.userInvitation,
            signInAliases: this.signInAliases,
            mfa: aws_cognito_1.Mfa.REQUIRED,
            mfaSecondFactor: { sms: true, otp: true },
            passwordPolicy: this.passwordPolicy,
        });
        this.userPoolClient = new aws_cognito_1.UserPoolClient(this.scope, `${this.id}-userpool-client`, {
            userPool: this.userPool,
            generateSecret: false,
        });
        this.handler = new lambda_factory_1.LambdaFactory(this.scope, handlers_list_1.Handlers.RegistrationHandler, {
            [env_vars_enum_1.EnvVars.userPoolId]: this.userPool.userPoolId,
            [env_vars_enum_1.EnvVars.userPoolClientId]: this.userPoolClient.userPoolClientId,
        }).getLambda();
    }
}
exports.default = AppUserPool;
//# sourceMappingURL=user-pool.js.map