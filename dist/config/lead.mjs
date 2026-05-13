import { MailAdapter } from "@lionrockjs/mod-mail";
import { FormCaptchaAdapter } from "@lionrockjs/mixin-form";
export default {
    defaultCountryCode: "+852",
    mailAdapter: MailAdapter,
    smsAdapter: MailAdapter,
    captchaAdapter: FormCaptchaAdapter,
    blockActivatedLeads: true,
    databasePath: 'database',
    greetingHandler: async (lead) => {
        return {
            leadName: lead.name,
            edmTypeGreeting: 'greeting',
            edmTypeGreetingSMS: 'greeting_sms',
            edmTypeAdminNotification: 'notification',
            greetingToken: {}
        };
    }
};
