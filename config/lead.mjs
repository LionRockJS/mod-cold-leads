import { MailAdapter } from "@lionrockjs/mod-mail";
import { FormCaptchaAdapter } from "@lionrockjs/mixin-form";
import Central from "@lionrockjs/central";

export default {
  defaultCountryCode: "+852",
  mailAdapter : MailAdapter,
  smsAdapter : MailAdapter,
  captchaAdapter: FormCaptchaAdapter,
  blockActivatedLeads: true,
  databasePath: `${Central.EXE_PATH}/../database`,
  greetingHandler : async (lead) => {
    return {
      leadName: lead.name,
      edmTypeGreeting: 'greeting',
      edmTypeGreetingSMS: 'greeting_sms',
      greetingToken: {}
    }
  }
}