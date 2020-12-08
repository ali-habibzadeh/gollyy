import { CognitoUserPool, CognitoUserAttribute, ISignUpResult } from "amazon-cognito-identity-js";
import { appConfig } from "../config/config.service";

export interface SignUpParams {
  email: string;
  username: string;
  password: string;
  phone: string;
}

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
}
