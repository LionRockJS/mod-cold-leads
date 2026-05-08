declare const _default: {
    defaultCountryCode: string;
    mailAdapter: any;
    smsAdapter: any;
    captchaAdapter: any;
    blockActivatedLeads: boolean;
    databasePath: string;
    greetingHandler: (lead: any) => Promise<{
        leadName: any;
        edmTypeGreeting: string;
        edmTypeGreetingSMS: string;
        edmTypeAdminNotification: string;
        greetingToken: {};
    }>;
};
export default _default;
