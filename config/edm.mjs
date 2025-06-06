import 'dotenv/config';
import { Central } from '@lionrockjs/central';
export default {
  salutation : new Map([
    ["en", new Map([["mr", "Mr."], ["mrs", "Mrs."], ["ms", "Ms."]])],
    ["zh-hans", new Map([["mr", "先生"], ["mrs", "太太"], ["ms", "女士"]])],
    ["zh-hant", new Map([["mr", "先生"], ["mrs", "太太"], ["ms", "女士"]])],
  ]),

  mail: {
    admin: process.env.EMAIL_ADMIN || 'developer@example.com',
    bcc: process.env.EMAIL_BCC || 'staff-developer@example.com',
    sender: process.env.EMAIL_SENDER || 'LionRockJS <do-not-reply@lionrockjs.com>',
    templatePath : Central.APP_PATH + '/../public/media/edm',
    defaultLanguage: 'en',

    greeting: {
      subject: new Map([
        ['en', 'Thank you for your registration'],
        ['zh-hans', '感谢您的注册'],
        ['zh-hant', '感謝你的登記']
      ]),
      text: new Map([
        ['en', 'We are delighted to confirm that we have received your request to find out more about Us. Our team will be in touch shortly.'],
        ['zh-hans', '我们很高兴地通知您，您的相关请求已被受理。 我们的团队将很快与您联系。'],
        ['zh-hant', '我們很高興地通知您，您的相關請求已被受理。我們的團隊將很快與您聯絡。']
      ]),
      html: new Map([
        ['en', 'en/thankyou.html'],
        ['zh-hans', 'zh-hans/thankyou.html'],
        ['zh-hant', 'zh-hant/thankyou.html']
      ]),
    },

    greeting_sms: {
      subject: new Map([
        ['en', 'Thank you for your registration'],
        ['zh-hans', '感谢您的注册'],
        ['zh-hant', '感謝你的登記']
      ]),
      text: new Map([
        ['en', 'We are delighted to confirm that we have received your request to find out more about Us. Our team will be in touch shortly.'],
        ['zh-hans', '我们很高兴地通知您，您的相关请求已被受理。 我们的团队将很快与您联系。'],
        ['zh-hant', '我們很高興地通知您，您的相關請求已被受理。我們的團隊將很快與您聯絡。']
      ]),
    },

    notification: {
      subject: new Map([
        ['en', 'You have a new registration'],
        ['zh-hans', '收到一项新注册'],
        ['zh-hant', '收到一項新登記']
      ]),
      text: new Map([
        ['en', 'You have a new registration'],
        ['zh-hans', '收到一项新注册'],
        ['zh-hant', '收到一項新登記']
      ]),
      html: new Map([
        ['en', 'en/admin.html'],
        ['zh-hans', 'zh-hans/admin.html'],
        ['zh-hant', 'zh-hant/admin.html']
      ]),
    },
  },
}