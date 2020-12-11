import { CognitoUserSession } from "amazon-cognito-identity-js";

export interface BaseUserParams {
  username: string;
}

export interface SignUpParams extends BaseUserParams {
  email: string;
  password: string;
  phone: string;
}

export interface ConfirmationParams extends BaseUserParams {
  code: string;
}

export interface AuthDetailsParams extends BaseUserParams {
  password: string;
}

export interface AuthResponse {
  session: CognitoUserSession;
  confirmed?: boolean;
}
