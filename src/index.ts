const ZBD_AUTH_URL = 'https://api.zebedee.io/v1/oauth2/authorize';
const ZBD_TOKEN_URL = 'https://api.zebedee.io/v1/oauth2/token';
const ZBD_USER_DATA_URL = 'https://api.zebedee.io/v1/oauth2/user';
const ZBD_WALLET_DATA_URL = 'https://api.zebedee.io/v1/oauth2/wallet';
const ZBD_DEFAULT_SCOPES = 'user,wallet';

export const getZBDProvider = ({
  clientId,
  clientSecret,
  apiKey,
  scope = ZBD_DEFAULT_SCOPES,
}: {
  clientId: string;
  clientSecret: string;
  apiKey: string;
  scope: string;
}) => ({
  id: "zbd",
  name: "ZBD",
  type: "oauth",
  clientId,
  clientSecret,
  authorization: {
    url: ZBD_AUTH_URL,
    params: { scope: ZBD_DEFAULT_SCOPES }
  },
  token: ZBD_TOKEN_URL,
  checks: ["pkce", "state"],
  userinfo: {
    async request(context: any) {
      // Default empty user wallet obj
      const emptyUserWallet = {
        "balance": null,
        "remainingAmountLimits": {
          "daily": null,
          "maxCredit": null,
          "monthly": null,
          "weekly": null,
        }
      }

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
      }

      const headers: { apikey: string; usertoken?: string; } = {
        apikey: apiKey,
      };

      if (context.tokens.access_token) {
        headers['usertoken'] = context.tokens.access_token;
      };

      if (!headers['usertoken']) {
        console.log('No access_token was found from the response of authorization request.');
        return { ...emptyUserProfile, ...emptyUserWallet };
      };

      // Fetching user profile and wallet data in parallel
      const t = await fetch(ZBD_USER_DATA_URL, {
        headers,
      });
      const d = await fetch(ZBD_WALLET_DATA_URL, {
        headers,
      });
      
      // Handling response from both fetches
      let all = {}
      if (t.ok) {
        const p = await t.json();
        all = { ...p.data };
      } else {
        console.log(`Response from ${ZBD_USER_DATA_URL} resulted in the following:`);
        console.log('Status Code:', t.status);
        console.log('Response Text:', t.statusText);
        all = { ...emptyUserProfile };
      };

      if (d.ok) {
        const p = await d.json();
        all = { ...all, ...p.data };
      } else {
        console.log(`Response from ${ZBD_WALLET_DATA_URL} resulted in the following:`);
        console.log('Status Code:', t.status);
        console.log('Response Text:', t.statusText);
        all = { ...all, ...emptyUserWallet };
      };

      // Returning all data
      return all;
    },
  },
  profile(profile: any) {
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
    }
  },
  style: {
    logo: "https://cdn.zebedee.io/zbdgg/social/zbd-pfp-default.png",
    logoDark: "https://cdn.zebedee.io/zbdgg/social/zbd-pfp-default.png",
    bg: "#fff",
    text: "#000",
    bgDark: "#000",
    textDark: "#fff",
  },
});
