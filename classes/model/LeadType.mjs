import { ORM } from '@lionrockjs/central';

export default class LeadType extends ORM{
  name = null;

  static joinTablePrefix = 'lead_type';
  static tableName = 'lead_types';

  static fields = new Map([
    ["name", "String"]
  ]);
  static hasMany = [
    ["lead_type_id", "Lead"]
  ];
}
