const {KohanaJS} = require('kohanajs');
KohanaJS.initConfig(new Map([
  ['edm', require('./config/edm')],
  ['lead', require('./config/lead')],
]));