import { CognitoUser } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";

import { AuthenticateParams, BaseUserParams, ConfirmSignInParams, ConfirmSignUpParams, SignUpParams } from "./registration.interface";

export class RegistrationService {
  private auth = Auth;

  public async signUp(params: SignUpParams): Promise<CognitoUser> {
    const { username, password, email, phoneNumber, givenName, familyName, address, birthdate } = params;
    const attrs = { email, address, birthdate, phone_number: phoneNumber, given_name: givenName, family_name: familyName };
    const { user } = await this.auth.signUp({ username, password, attributes: attrs });
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

  public async signOut(): Promise<unknown> {
    return this.auth.signOut({ global: true });
  }
}
