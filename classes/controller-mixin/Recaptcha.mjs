import {Controller, ControllerMixin} from "@lionrockjs/mvc";
import {Central} from "@lionrockjs/central";
import {ControllerMixinMultipartForm} from "@lionrockjs/mod-form";

import querystring from "node:querystring";
import axios from "axios";

export default class ControllerMixinRecaptcha extends ControllerMixin {
  static async action_update(state) {
    if(!Central.config.lead.recaptcha?.site_key)return;
    const remoteip = state.get(Controller.STATE_CLIENT_IP);
    const $_POST = state.get(ControllerMixinMultipartForm.POST_DATA);

    //recaptcha
    const formData = querystring.stringify({
      secret: Central.config.lead.recaptcha.secret,
      response: $_POST['grecaptcha'],
      remoteip,
    });

    const client = state.get('client');
    const recaptcha = await axios.post('https://www.google.com/recaptcha/api/siteverify', formData)
    if(!recaptcha.data.success || recaptcha.data.score < 0.5){
      this.body.error = true;
      this.body.payload.error = "recaptcha_fail"
      await client.exit(200);
    }
  }
}