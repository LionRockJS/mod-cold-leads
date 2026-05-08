import 'dotenv/config';
declare const _default: {
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
export default _default;
