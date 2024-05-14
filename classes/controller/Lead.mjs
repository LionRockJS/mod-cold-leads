import {Controller} from "@lionrockjs/mvc";
import {ControllerMixinORMRead, ControllerMixinORMInput, ControllerMixinORMWrite} from "@lionrockjs/mixin-orm";
import {ControllerMixinMultipartForm, ControllerMixinCaptcha} from "@lionrockjs/mixin-form";
import {ControllerMixinMime, ControllerMixinView, ControllerMixinDatabase, Central, ORM} from "@lionrockjs/central";

import HelperEdm from '../helper/Edm.mjs';

import DefaultLead from '../model/Lead.mjs';
const Lead = await ORM.import('Lead', DefaultLead);
import DefaultLeadInfo from '../model/LeadInfo.mjs';
const LeadInfo = await ORM.import('LeadInfo', DefaultLeadInfo);
import DefaultLeadAction from '../model/LeadAction.mjs';
const LeadAction = await ORM.import('LeadAction', DefaultLeadAction);


export default class ControllerLead extends Controller{
  static mixins = [...Controller.mixins,
    ControllerMixinMime,
    ControllerMixinView,
    ControllerMixinDatabase,
    ControllerMixinMultipartForm,
    ControllerMixinCaptcha,
    ControllerMixinORMInput,
    ControllerMixinORMWrite,
  ]

  static STATE_

  constructor(request, options = {}){
    super(request);

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
      .set('lead_info', Central.config.lead.databasePath+'/lead_info.sqlite')
      .set('lead_action', Central.config.lead.databasePath+'/lead_action.sqlite')
      .set('mail', Central.config.lead.databasePath+'/mail.sqlite');

    this.state.set(ControllerMixinORMWrite.DATABASE_KEY, 'lead');
    this.state.set(ControllerMixinCaptcha.CAPTCHA_ADAPTER, Central.config.lead.captchaAdapter);
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
    if(Central.config.lead.blockActivatedLeads !== true)return true;
    const $_POST = this.state.get(ControllerMixinMultipartForm.POST_DATA);
    const databases = this.state.get(ControllerMixinDatabase.DATABASES);
    const database = databases.get('lead');

    // check if contact is already registered
    // if register contact type is phone, optional contact area code may prepend.
    const lead = await ORM.readBy(Lead, 'contact', [
      $_POST[':contact'],
      ($_POST['contact_area_code'] || Central.config.lead.defaultCountryCode) + $_POST[':contact'],
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
    ControllerMixinView.setTemplate(this.options.templates.get('thank_you'));
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
    const memberIds = $_POST['.members'];
    const parent = this.state.get('instance');

    await Promise.all(memberIds.map(async id =>{
      const values = $_POST['.members'+id];

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
      Object.assign(lead, props);
      await lead.write();

      const info = ORM.create(LeadInfo, {
        database: databases.get('lead_info'),
        insertID: lead.id
      });
      Object.assign(info, infos);
      info.parent_id = String(parent.id);
      await info.write();

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
        instance.contact = $_POST['contact_area_code'] + instance.contact;
      }
    }

    await instance.write();

    //store attributes to info
    const info = ORM.create(LeadInfo, {database: databases.get('lead_info'), insertID: instance.id})
    const attributes = $_POST['attributes'];

    if(attributes){
      delete attributes.id;
      delete attributes.created_at;
      delete attributes.updated_at;
      delete attributes.uuid;
      Object.assign(info, attributes);
      try{
        await info.write();
      }catch(e){
        Central.log(e);
      }

      instance.lead_info = info.id ? info : attributes;
    }

    const postAction = $_POST['action'];
    if(postAction){
      const action = ORM.create(LeadAction, {database: databases.get('lead_action')})
      action.name = postAction;
      action.lead_id = instance.id;
      await action.write();
    }

    if($_POST['.members']){
      await this.add_members();
    }

    if(postAction === 'save'){
      await this.redirect($_POST.destination || `/${this.state.get(Controller.STATE_LANGUAGE)}/registration/${instance.id}`);
      return;
    }

    //check duplicate
    //verified lead

    const helperEdm = new HelperEdm(
      this.state.get(Controller.STATE_CLIENT_IP),
      this.state.get(Controller.STATE_HOSTNAME),
      Central.config.lead.mailAdapter
    );

    const helperSMS = new HelperEdm(
      this.state.get(Controller.STATE_CLIENT_IP),
      this.state.get(Controller.STATE_HOSTNAME),
      Central.config.lead.smsAdapter
    );

    const{
      edmTypeGreeting,
      edmTypeGreetingSMS,
      greetingToken
    } = await Central.config.lead.greetingHandler(instance);

    try{
      const contact = await ControllerLead.send_greeting(instance, info, helperSMS, helperEdm, edmTypeGreeting, edmTypeGreetingSMS, greetingToken);
      const tokenEmail = info.email || contact;
      await helperEdm.send(Central.config.edm.mail.admin, instance, info, 'notification', {
        title: instance.salutation,
        email : tokenEmail.replaceAll('.', '<span>.</span>'),
        agent : this.state.get(Controller.STATE_HEADERS)['user-agent'],
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