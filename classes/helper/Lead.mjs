import {ORM} from "@lionrockjs/central";
import DefaultLeadAction from '../model/LeadAction.mjs';
const LeadAction = await ORM.import('LeadAction', DefaultLeadAction);

export default class HelperLead{
  static async write_action(database, clientIP, lead_id, actionName, payload={}){
    const action = ORM.create(LeadAction, {database});
    Object.assign(action, {
      lead_id,
      name: actionName,
      ip: clientIP,
      payload: JSON.stringify(payload),
    });
    await action.write();
  }
}