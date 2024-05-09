import { Model } from '@lionrockjs/central';

export default class LeadState extends Model{
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
