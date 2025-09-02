export default {
  filename: import.meta.url,
  configs: ['edm', 'lead']
}

import ControllerLead from './classes/controller/Lead.mjs';
import HelperEdm from './classes/helper/Edm.mjs';
import ModelLead from './classes/model/Lead.mjs';
import ModelLeadState from './classes/model/LeadState.mjs';
import ModelLeadType from './classes/model/LeadType.mjs';

export {
  ControllerLead,
  HelperEdm,
  ModelLead,
  ModelLeadState,
  ModelLeadType
};
