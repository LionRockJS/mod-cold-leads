import { Model } from '@lionrockjs/central';

export default class LeadAction extends Model{
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
