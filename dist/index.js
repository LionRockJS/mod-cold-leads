import ConfigEdm from './config/edm.mjs';
import ConfigLead from './config/lead.mjs';
export default {
    configs: {
        edm: ConfigEdm,
        lead: ConfigLead,
    }
};
import ControllerLead from '../classes/controller/Lead.mjs';
import HelperEdm from '../classes/helper/Edm.mjs';
import ModelLead from '../classes/model/Lead.mjs';
import ModelLeadState from '../classes/model/LeadState.mjs';
import ModelLeadType from '../classes/model/LeadType.mjs';
export { ControllerLead, HelperEdm, ModelLead, ModelLeadState, ModelLeadType };
