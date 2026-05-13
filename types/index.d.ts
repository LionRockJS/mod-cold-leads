declare const _default: {
    configs: {
        edm: {
            salutation: Map<string, Map<string, string>>;
            mail: {
                admin: string;
                bcc: string;
                sender: string;
                templatePath: string;
                defaultLanguage: string;
                greeting: {
                    subject: Map<string, string>;
                    text: Map<string, string>;
                    html: Map<string, string>;
                };
                greeting_sms: {
                    subject: Map<string, string>;
                    text: Map<string, string>;
                };
                notification: {
                    subject: Map<string, string>;
                    text: Map<string, string>;
                    html: Map<string, string>;
                };
            };
        };
        lead: {
            defaultCountryCode: string;
            mailAdapter: any;
            smsAdapter: any;
            captchaAdapter: typeof import("@lionrockjs/mixin-form").FormCaptchaAdapter;
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
    };
};
export default _default;
import ControllerLead from '../classes/controller/Lead.mjs';
import HelperEdm from '../classes/helper/Edm.mjs';
import ModelLead from '../classes/model/Lead.mjs';
import ModelLeadState from '../classes/model/LeadState.mjs';
import ModelLeadType from '../classes/model/LeadType.mjs';
export { ControllerLead, HelperEdm, ModelLead, ModelLeadState, ModelLeadType };
