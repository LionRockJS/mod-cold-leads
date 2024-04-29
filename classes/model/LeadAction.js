const {ORM} = require('kohanajs');

class LeadAction extends ORM{
  lead_id = null;
  name = null;
  ip = null;
  payload = null;

  static joinTablePrefix = 'lead_action';
  static tableName = 'lead_actions';

  static fields = new Map([
    ["lead_id", "Int!"],
    ["name", "String!"],
    ["ip", "String!"],
    ["payload", "String"]
  ]);
}

module.exports = LeadAction;
