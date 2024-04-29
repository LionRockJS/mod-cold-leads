import url from "node:url";
const dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');
export default {dirname}

import ControllerLead from './classes/controller/Lead.mjs';
import HelperEdm from './classes/helper/Edm.mjs';
import HelperLead from './classes/helper/Lead.mjs';

export {
  ControllerLead,
  HelperEdm,
  HelperLead,
};
