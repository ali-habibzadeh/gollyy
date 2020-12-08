"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const config_service_1 = require("../config/config.service");
class RegistrationService {
    constructor() {
        this.userPool = new amazon_cognito_identity_js_1.CognitoUserPool({
            UserPoolId: config_service_1.appConfig.userPoolId,
            ClientId: config_service_1.appConfig.userPoolClientId,
        });
    }
    async signUp({ email, username, password, phone }) {
        return new Promise((resolve, reject) => {
            const attrs = [
                new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "email", Value: email }),
                new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "phonne", Value: phone }),
            ];
            this.userPool.signUp(username, password, attrs, [], (err, result) => (err ? reject(err) : resolve(result)));
        });
    }
}
exports.RegistrationService = RegistrationService;
//# sourceMappingURL=registration.service.js.map