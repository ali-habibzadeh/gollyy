import { CognitoIdentityServiceProvider, SNS } from "aws-sdk";

export default class UsersService {
  private sns = new SNS({});

  private cognito = new CognitoIdentityServiceProvider({});

  public getUser(): Promise<unknown> {
    return this.cognito.getUser().promise();
  }
}
