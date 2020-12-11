import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";

import { AuthenticateParams, BaseUserParams, ConfirmSignInParams, ConfirmSignUpParams, SignUpParams } from "./registration.interface";

export class RegistrationService {
  private auth = Auth;

  public async signUp({ email, username, password, phone }: SignUpParams): Promise<CognitoUser> {
    const attrs = { attributes: { email, phone_number: phone } };
    const { user } = await this.auth.signUp({ username, password, ...attrs });
    return user;
  }

  public async confirmSignUp({ username, code }: ConfirmSignUpParams): Promise<void> {
    return this.auth.confirmSignUp(username, code);
  }

  public async resendSignUp({ username }: BaseUserParams): Promise<void> {
    return this.auth.resendSignUp(username);
  }

  public async signIn({ username, password }: AuthenticateParams): Promise<CognitoUser> {
    const user = await this.auth.signIn(username, password);
    return user;
  }

  public async confirmSignIn({ user, code }: ConfirmSignInParams): Promise<CognitoUser> {
    return this.auth.confirmSignIn(user, code);
  }
}
