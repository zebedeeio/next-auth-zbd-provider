export declare const getZBDProvider: ({ clientId, clientSecret, apiKey, }: {
    clientId: string;
    clientSecret: string;
    apiKey: string;
}) => {
    id: string;
    name: string;
    type: string;
    clientId: string;
    clientSecret: string;
    authorization: {
        url: string;
        params: {
            scope: string;
        };
    };
    token: string;
    checks: string[];
    userinfo: {
        request(context: any): Promise<{}>;
    };
    profile(profile: any): {
        id: any;
        email: any;
        gamertag: any;
        image: any;
        isVerified: any;
        lightningAddress: any;
        publicBio: any;
        publicStaticCharge: any;
        social: any;
        balance: any;
        remainingAmountLimits: any;
    };
    style: {
        logo: string;
        logoDark: string;
        bg: string;
        text: string;
        bgDark: string;
        textDark: string;
    };
};
