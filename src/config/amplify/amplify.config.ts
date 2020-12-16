import Amplify from "aws-amplify";

import { appConfig } from "../app-config/config.service";

const { region, userPoolId, userPoolClientId } = appConfig;

Amplify.configure({
  Auth: {
    region,
    userPoolId,
    userPoolWebClientId: userPoolClientId,
  },
});
