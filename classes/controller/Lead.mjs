import {Controller} from "@lionrockjs/mvc";
import {ControllerMixinORMRead, ControllerMixinORMInput, ControllerMixinORMWrite} from "@lionrockjs/mixin-orm";
import {ControllerMixinMultipartForm, ControllerMixinCaptcha} from "@lionrockjs/mixin-form";
import {ControllerMixinMime, ControllerMixinView, ControllerMixinDatabase, Central, ORM} from "@lionrockjs/central";

import HelperPageEdit from '../helper/PageEdit.mjs';
import HelperEdm from '../helper/Edm.mjs';

import DefaultLead from '../model/Lead.mjs';
const Lead = await ORM.import('Lead', DefaultLead);


export default class ControllerLead extends Controller{
  static STATE_CONFIG = 'leadConfig';
  static STATE_CONFIG_EDM_MAIL = 'leadConfigEdmMail';

  static mixins = [...Controller.mixins,
    ControllerMixinMime,
    ControllerMixinView,
    ControllerMixinDatabase,
    ControllerMixinMultipartForm,
    ControllerMixinCaptcha,
    ControllerMixinORMInput,
    ControllerMixinORMWrite,
  ];

  constructor(request, state, options = {}){
    super(request, state);

    this.options = {
      templates: new Map([
        ['index', 'templates/pages/register'],
        ['thank_you', 'templates/pages/register-thank-you'],
        ['duplicate', 'templates/pages/register-duplicate'],
        ['verify', 'templates/pages/register-verify'],
        ['error', 'templates/pages/register-error'],
      ]),
      ...options };

    this.state.set(ControllerMixinORMRead.MODEL, Lead);
    this.state.get(ControllerMixinDatabase.DATABASE_MAP)
      .set('lead', Central.config.lead.databasePath+'/lead.sqlite')
      .set('mail', Central.config.lead.databasePath+'/mail.sqlite');

    this.state.set(ControllerMixinORMWrite.DATABASE_KEY, 'lead');
    this.state.set(ControllerMixinCaptcha.CAPTCHA_ADAPTER, Central.config.lead.captchaAdapter);

    this.state.set(ControllerLead.STATE_CONFIG, Object.assign({}, Central.config.lead));
    this.state.set(ControllerLead.STATE_CONFIG_EDM_MAIL, Object.assign({}, Central.config.edm.mail));
  }

  async action_index() {
    const $_GET = this.state.get(ControllerMixinMultipartForm.GET_DATA);
    const country = this.state.get(Controller.STATE_HEADERS)['cf-ipcountry'] || 'HK'

    Object.assign(
      this.state.get(ControllerMixinView.LAYOUT).data,
      {
        scripts: ['form.js'],
        stylesheets: ['register.css'],
        page: 'register',
        country
      }
    )

    ControllerMixinView.setTemplate(this.state, this.options.templates.get('index'), {
      country: country,
      utm_source: encodeURIComponent($_GET['utm_source'] || ""),
      utm_medium: encodeURIComponent($_GET['utm_medium'] || ""),
      utm_campaign: encodeURIComponent($_GET['utm_campaign'] || ""),
      utm_term: encodeURIComponent($_GET['utm_term'] || ""),
      utm_content: encodeURIComponent($_GET['utm_content'] || ""),
    });
  }

  async isActivated(){
    const configLead = this.state.get(ControllerLead.STATE_CONFIG);

    if(configLead.blockActivatedLeads !== true)return true;
    const $_POST = this.state.get(ControllerMixinMultipartForm.POST_DATA);
    const database = this.state.get(ControllerMixinDatabase.DATABASES).get('lead');

    // check if contact is already registered
    // if register contact type is phone, optional contact area code may prepend.
    const lead = await ORM.readBy(Lead, 'contact', [
      $_POST[':contact'],
      ($_POST['@contact_area_code'] || configLead.defaultCountryCode) + $_POST[':contact'],
    ], {database, asArray: true});

    //loop all leads and check if any of them is activated
    const activatedLeads = lead.map(it => it.lead_state_id).filter(it => it === 3);
    return activatedLeads.length <= 0;
  }

  async action_verify() {
    const isActivated = await this.isActivated();
    if(!isActivated){
      await this.redirect(`/${this.state.get(Controller.STATE_LANGUAGE)}/registration/duplicate`);
      return;
    }

    const $_POST = this.state.get(ControllerMixinMultipartForm.POST_DATA);
    ControllerMixinView.setTemplate(this.state, this.options.templates.get('verify'), {postData: $_POST});
  }

  async action_thank_you(){
    ControllerMixinView.setTemplate(this.state, this.options.templates.get('thank_you'));
  }

  async action_thank_you_json(){
    this.state.set(Controller.STATE_BODY, {
      type: "REGISTER",
      payload: {success: true}
    });
  }

  async action_duplicate(){
    ControllerMixinView.setTemplate(this.state, this.options.templates.get('duplicate'));
  }

  async action_duplicate_json(){
    this.state.set(Controller.STATE_BODY, {
      type: "REGISTER_CONTACT_ALREADY_ACTIVATE",
      error: true,
      payload: {
        message: "Registration duplicated"
      }
    });
  }

  async add_members(){
    const databases = this.state.get(ControllerMixinDatabase.DATABASES);

    const $_POST = this.state.get(ControllerMixinMultipartForm.POST_DATA);
    const memberIds = $_POST['members'];
    const parent = this.state.get('instance');

    await Promise.all(memberIds.map(async id =>{
      const values = $_POST['members'+id];

      const props = {
        language: this.state.get(Controller.STATE_LANGUAGE),
        ip: parent.ip,
        hostname: parent.hostname,
        user_agent: parent.user_agent,
        lead_state_id: parent.lead_state_id,
        contact_type: 'proxy',
        contact: String(parent.id),
        utm_source: parent.utm_source,
        utm_medium: parent.utm_medium,
        utm_campaign: parent.utm_campaign,
        utm_term: parent.utm_term,
        utm_content: parent.utm_content
      };
      //todo, read postData to members
      const infos = {};
      Object.keys(values).forEach(key =>{
        if(/^_/.test(key)){
          props[key.replace(/^_/, '')] = values[key];
        }else{
          infos[key] = values[key];
        }
      })
      if(!props.name)return;

      const lead = ORM.create(Lead, {database: databases.get('lead')});
      //todo, parse postData to original then save
      Object.assign(lead, props);
      await lead.write();
    }));
  }

  //use action_update to create new lead
  async action_update(){
    const isActivated = await this.isActivated();
    if(!isActivated){
      await this.redirect(`/${this.state.get(Controller.STATE_LANGUAGE)}/registration/duplicate`);
      return;
    }

    const $_POST = this.state.get(ControllerMixinMultipartForm.POST_DATA);

    const databases = this.state.get(ControllerMixinDatabase.DATABASES);
    const instance = this.state.get(ControllerMixinORMRead.INSTANCE);

    instance.ip = this.state.get(Controller.STATE_CLIENT_IP);
    instance.hostname = this.state.get(Controller.STATE_HOSTNAME);
    instance.user_agent = this.state.get(Controller.STATE_USER_AGENT);

    if(instance.contact_type === 'phone'){
      //check contact start with + sign
      if(!instance.contact.startsWith('+')){
        instance.contact = $_POST['@contact_area_code'] + instance.contact;
      }
    }

    const original = JSON.parse(instance.original || '{}');
    HelperPageEdit.mergeOriginals(original, HelperPageEdit.postToOriginal($_POST));

    //store attributes to info
    const postAction = $_POST['action'];

    if(postAction){
      original.items.actions = original.items.actions || []
      original.items.actions.push({
        attributes: {
          name: postAction,
          ip: this.state.get(Controller.STATE_CLIENT_IP)
        }
      })
    }

    instance.original = JSON.stringify(original);
    await instance.write();

    //todo, parse postData to original then save
    if($_POST['members']){
      await this.add_members();
    }

    if(postAction === 'save'){
      await this.redirect($_POST.destination || `/${this.state.get(Controller.STATE_LANGUAGE)}/registration/${instance.id}`);
      return;
    }

    //check duplicate
    //verified lead
    const configLead = this.state.get(ControllerLead.STATE_CONFIG);

    const helperEdm = new HelperEdm(
      this.state.get(Controller.STATE_CLIENT_IP),
      this.state.get(Controller.STATE_HOSTNAME),
      configLead.mailAdapter
    );

    const helperSMS = new HelperEdm(
      this.state.get(Controller.STATE_CLIENT_IP),
      this.state.get(Controller.STATE_HOSTNAME),
      configLead.smsAdapter
    );

    const{
      edmTypeGreeting,
      edmTypeGreetingSMS,
      greetingToken,
      edmTypeAdminNotification
    } = await configLead.greetingHandler(instance);

    const configEdmMail = this.state.get(ControllerLead.STATE_CONFIG_EDM_MAIL);
    try{
      const contact = await ControllerLead.send_greeting(instance, info, helperSMS, helperEdm, edmTypeGreeting, edmTypeGreetingSMS, greetingToken);
      const tokenEmail = info.email || contact;


      await helperEdm.send(configEdmMail.admin, instance, info, edmTypeAdminNotification, {
        title: instance.salutation,
        email : tokenEmail.replaceAll('.', '<span>.</span>'),
        agent : this.state.get(Controller.STATE_USER_AGENT),
      });
    }catch(e){
      ControllerMixinView.setTemplate(this.state, this.options.templates.get('error'), {message: e.message});
      await info.delete();
      await instance.delete();
      return;
    }

    await this.redirect($_POST.destination || `/${this.state.get(Controller.STATE_LANGUAGE)}/registration/thank-you?lead_id=${instance.id}`);
  }

  //dynamic greeting type for multiple greeting template
  static async send_greeting(instance, info, helperSMS, helperEdm, edmTypeGreeting = 'greeting', edmTypeGreetingSMS = 'greeting_sms', tokens={}){
    let contact = '';
    switch (instance.contact_type){
      case 'email':
        contact = instance.contact || info.email;
        if(contact){
          await helperEdm.send(contact, instance, info, edmTypeGreeting, tokens);
        }
        break;
      case 'phone':
        const email = info.email;

        contact = instance.contact || (info.area_code + info.phone);
        if(contact){
          await helperSMS.send(contact, instance, info, edmTypeGreetingSMS, tokens);
        }

        if(email){
          await helperEdm.send(email, instance, info, edmTypeGreeting, tokens);
        }
        break;
    }

    return contact;
  }
}