const { ControllerMixin } = require('@kohanajs/core-mvc');
const { ControllerMixinMultipartForm } = require('@kohanajs/mod-form');
const { KohanaJS } = require('kohanajs');
const querystring = require("querystring");
const {default: axios} = require("axios");

class ControllerMixinRecaptcha extends ControllerMixin {
  static async action_update(state) {
    if(!KohanaJS.config.lead.recaptcha?.site_key)return;
    const client = state.get('client');
    const remoteip = client.clientIP;
    const $_POST = state.get(ControllerMixinMultipartForm.POST_DATA);

    //recaptcha
    const formData = querystring.stringify({
      secret: KohanaJS.config.lead.recaptcha.secret,
      response: $_POST['grecaptcha'],
      remoteip,
    });

    const recaptcha = await axios.post('https://www.google.com/recaptcha/api/siteverify', formData)
    if(!recaptcha.data.success || recaptcha.data.score < 0.5){
      this.body.error = true;
      this.body.payload.error = "recaptcha_fail"
      await client.exit(200);
    }
  }
}

module.exports = ControllerMixinRecaptcha;
