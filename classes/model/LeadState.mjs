import { ORM } from '@lionrockjs/central';

export default class LeadState extends ORM{
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
