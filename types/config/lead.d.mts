import { FormCaptchaAdapter } from "@lionrockjs/mixin-form";
declare const _default: {
    defaultCountryCode: string;
    mailAdapter: any;
    smsAdapter: any;
    captchaAdapter: typeof FormCaptchaAdapter;
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
