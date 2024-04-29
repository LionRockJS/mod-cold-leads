import { MailAdapter } from "@lionrockjs/mod-mail";

export default {
  salt: "71da4035-e95e-4807-9921-9134fdd4202b",
  mailAdapter : MailAdapter,
  smsAdapter : MailAdapter,
  recaptcha:{
    site_key: "",
    secret: "",
  },
  blockActivatedLeads: true,
  greetingHandler : async (lead) => {
    return {
      leadName: lead.name,
      edmTypeGreeting: 'greeting',
      edmTypeGreetingSMS: 'greeting_sms',
      greetingToken: {}
    }
  }
}