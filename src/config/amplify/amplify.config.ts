import Amplify from "aws-amplify";

import { appConfig } from "../app-config/config.service";

Amplify.configure({
  Auth: {
    region: appConfig.region,
    userPoolId: appConfig.userPoolId,
    userPoolWebClientId: appConfig.userPoolClientId,
  },
});
