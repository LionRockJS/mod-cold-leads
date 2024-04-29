const {ORM} = require('kohanajs');

class LeadState extends ORM{
  name = null;

  static joinTablePrefix = 'lead_state';
  static tableName = 'lead_states';

  static fields = new Map([
    ["name", "String"]
  ]);
  static hasMany = [
    ["lead_state_id", "Lead"]
  ];
}

module.exports = LeadState;
