require('kohanajs').addNodeModule(__dirname);
const ControllerLead = require('./classes/controller/Lead');
const HelperEdm = require('./classes/helper/Edm');
const HelperLead = require('./classes/helper/Lead');

module.exports = {
  ControllerLead,
  HelperEdm,
  HelperLead,
};
