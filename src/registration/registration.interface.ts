import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";

export interface BaseUserParams {
  username: string;
}

export interface SignUpParams extends BaseUserParams {
  email: string;
  password: string;
  phoneNumber: string;
  givenName: string;
  familyName: string;
  address: string;
  birthdate: string;
}

export interface ConfirmSignUpParams extends BaseUserParams {
  code: string;
}

export interface AuthenticateParams extends BaseUserParams {
  password: string;
}

export interface AuthResponse {
  session: CognitoUserSession;
  confirmed?: boolean;
}

export interface ConfirmSignInParams {
  user: CognitoUser;
  code: string;
}
