const {KohanaJS} = require('kohanajs');
const { Mail } = require('@kohanajs/mod-mail');

class HelperEdm {
  constructor(clientIP, landing, adapter = null) {
    this.mailer = new Mail({
      domain: landing,
      ip: clientIP,
      adapter : adapter || Mail.defaultMailAdapter,
    });
  }

  async send(recipient, instance, lead_info, type, token={}){
    const config = KohanaJS.config.edm.mail;
    const language = instance.language;
    const leadInfo = lead_info;
    const edmConfig = config[type];
    if(!edmConfig)return;

    const sender  = edmConfig.sender || config.sender;
    const cc      = edmConfig.cc     ?? config.cc;
    const bcc     = edmConfig.bcc    ?? config.bcc;
    const subject = edmConfig.subject.get(language);
    const text    = edmConfig.text.get(language);

    const html    = edmConfig.html ? await this.mailer.readTemplate(
      config.templatePath,
      edmConfig.html.get(language)
    ) : "";

    return this.mailer.send(subject, text, sender, recipient, {
      tokens: Object.assign(
        instance,
        leadInfo,
        {
          email: recipient.replaceAll('.', '<span>.</span>'),
        },
        token
      ),
      html,
      cc,
      bcc,
      entity: 'Lead',
      entity_id : String(instance.id)
    });
  }
}

module.exports = HelperEdm;
