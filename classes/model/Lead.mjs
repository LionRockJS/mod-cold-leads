const {ORM} = require('kohanajs');

class Lead extends ORM{
  lead_state_id = 1;
  lead_type_id = 1;
  language = "zh-hant";
  name = null;
  contact_type = null;
  contact = null;
  consent = null;
  utm_source = null;
  utm_medium = null;
  utm_campaign = null;
  utm_term = null;
  utm_content = null;
  ip = null;
  hostname = null;
  user_agent = null;

  static joinTablePrefix = 'lead';
  static tableName = 'leads';

  static fields = new Map([
    ["language", "String!"],
    ["name", "String!"],
    ["contact_type", "String"],
    ["contact", "String"],
    ["consent", "Boolean"],
    ["utm_source", "String"],
    ["utm_medium", "String"],
    ["utm_campaign", "String"],
    ["utm_term", "String"],
    ["utm_content", "String"],
    ["ip", "String"],
    ["hostname", "String"],
    ["user_agent", "String"]
  ]);
  static belongsTo = new Map([
    ["lead_state_id", "LeadState"],
    ["lead_type_id", "LeadType"]
  ]);
}

module.exports = Lead;
