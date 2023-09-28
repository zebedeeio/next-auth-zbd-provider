"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZBDProvider = void 0;
const ZBD_AUTH_URL = 'https://api.zebedee.io/v1/oauth2/authorize';
const ZBD_TOKEN_URL = 'https://api.zebedee.io/v1/oauth2/token';
const ZBD_USER_DATA_URL = 'https://api.zebedee.io/v1/oauth2/user';
const ZBD_WALLET_DATA_URL = 'https://api.zebedee.io/v1/oauth2/wallet';
const ZBD_SCOPES = 'user wallet';
const getZBDProvider = ({ clientId, clientSecret, apiKey, }) => ({
    id: "zbd",
    name: "ZBD",
    type: "oauth",
    clientId,
    clientSecret,
    authorization: {
        url: ZBD_AUTH_URL,
        params: { scope: ZBD_SCOPES }
    },
    token: ZBD_TOKEN_URL,
    checks: ["pkce", "state"],
    userinfo: {
        request(context) {
            return __awaiter(this, void 0, void 0, function* () {
                // Default empty user wallet obj
                const emptyUserWallet = {
                    "balance": null,
                    "remainingAmountLimits": {
                        "daily": null,
                        "maxCredit": null,
                        "monthly": null,
                        "weekly": null,
                    }
                };
                // Default empty user profile obj
                const emptyUserProfile = {
                    "id": null,
                    "email": null,
                    "gamertag": null,
                    "image": null,
                    "isVerified": null,
                    "lightningAddress": null,
                    "publicBio": null,
                    "publicStaticCharge": null,
                    "social": {},
                };
                const headers = {
                    apikey: apiKey,
                };
                if (context.tokens.access_token) {
                    headers['usertoken'] = context.tokens.access_token;
                }
                ;
                if (!headers['usertoken']) {
                    console.log('No access_token was found from the response of authorization request.');
                    return Object.assign(Object.assign({}, emptyUserProfile), emptyUserWallet);
                }
                ;
                // Fetching user profile and wallet data in parallel
                const t = yield fetch(ZBD_USER_DATA_URL, {
                    headers,
                });
                const d = yield fetch(ZBD_WALLET_DATA_URL, {
                    headers,
                });
                // Handling response from both fetches
                let all = {};
                if (t.ok) {
                    const p = yield t.json();
                    all = Object.assign({}, p.data);
                }
                else {
                    console.log(`Response from ${ZBD_USER_DATA_URL} resulted in the following:`);
                    console.log('Status Code:', t.status);
                    console.log('Response Text:', t.statusText);
                    all = Object.assign({}, emptyUserProfile);
                }
                ;
                if (d.ok) {
                    const p = yield d.json();
                    all = Object.assign(Object.assign({}, all), p.data);
                }
                else {
                    console.log(`Response from ${ZBD_WALLET_DATA_URL} resulted in the following:`);
                    console.log('Status Code:', t.status);
                    console.log('Response Text:', t.statusText);
                    all = Object.assign(Object.assign({}, all), emptyUserWallet);
                }
                ;
                // Returning all data
                return all;
            });
        },
    },
    profile(profile) {
        return {
            // User profile properties
            "id": profile['id'],
            "email": profile['email'],
            "gamertag": profile['gamertag'],
            "image": profile['image'],
            "isVerified": profile['isVerified'],
            "lightningAddress": profile['lightningAddress'],
            "publicBio": profile['publicBio'],
            "publicStaticCharge": profile['publicStaticCharge'],
            "social": profile['social'],
            // User wallet properties
            "balance": profile['balance'],
            "remainingAmountLimits": profile['remainingAmountLimits'],
        };
    },
    style: {
        logo: "/foursquare.svg",
        logoDark: "/foursquare-dark.svg",
        bg: "#fff",
        text: "#000",
        bgDark: "#000",
        textDark: "#fff",
    },
});
exports.getZBDProvider = getZBDProvider;
