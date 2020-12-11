import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, ISignUpResult } from "amazon-cognito-identity-js";

import { appConfig } from "../config/config.service";
import { AuthDetailsParams, AuthResponse, BaseUserParams, ConfirmationParams, SignUpParams } from "./registration.interface";

export class RegistrationService {
  private userPool = new CognitoUserPool({
    UserPoolId: appConfig.userPoolId,
    ClientId: appConfig.userPoolClientId,
  });

  public async signUp({ email, username, password, phone }: SignUpParams): Promise<ISignUpResult | undefined> {
    return new Promise((resolve, reject) => {
      const attrs = [
        new CognitoUserAttribute({ Name: "email", Value: email }),
        new CognitoUserAttribute({ Name: "phone_number", Value: phone }),
      ];
      this.userPool.signUp(username, password, attrs, [], (err, result) =>
        err ? reject(JSON.stringify(err)) : resolve(result),
      );
    });
  }

  public async confirmRegistration({ username, code }: ConfirmationParams): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Pool: this.userPool, Username: username });
      user.confirmRegistration(code, true, (err, result) => (err ? reject(JSON.stringify(err)) : resolve(result)));
    });
  }

  public async resendConfirmationCode({ username }: BaseUserParams): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Pool: this.userPool, Username: username });
      user.resendConfirmationCode((err, result) => (err ? reject(JSON.stringify(err)) : resolve(result)));
    });
  }

  public authenticateUser({ username, password }: AuthDetailsParams): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      const details = new AuthenticationDetails({ Username: username, Password: password });
      const user = new CognitoUser({ Pool: this.userPool, Username: username });
      user.authenticateUser(details, {
        onSuccess: (session, confirmed) => resolve({ session, confirmed }),
        onFailure: reject,
      });
    });
  }
}
