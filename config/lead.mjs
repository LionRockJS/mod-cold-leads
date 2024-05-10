import { MailAdapter } from "@lionrockjs/mod-mail";
import { FormCaptchaAdapter } from "@lionrockjs/mixin-form";
import Central from "@lionrockjs/central";

export default {
  salt: "71da4035-e95e-4807-9921-9134fdd4202b",
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