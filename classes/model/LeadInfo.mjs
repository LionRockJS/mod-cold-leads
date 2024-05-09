import { Model } from '@lionrockjs/central';

export default class LeadInfo extends Model{
  email = null;
  phone = null;
  message = null;

  static joinTablePrefix = 'lead_info';
  static tableName = 'lead_infos';

  static fields = new Map([
    ["email", "String"],
    ["phone", "String"],
    ["message", "String"]
  ]);
}