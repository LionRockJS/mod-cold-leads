const path = require('path');
const { build } = require('kohanajs-start');

build(
  `${__dirname}/lead.graphql`,
  `${__dirname}/lead.js`,
  `${__dirname}/exports/lead.sql`,
  `${__dirname}/default/db/www/lead.sqlite`,
  path.normalize(`${__dirname}/../classes/model`)
);

build(
  `${__dirname}/lead_info.graphql`,
  ``,
  `${__dirname}/exports/lead_info.sql`,
  `${__dirname}/default/db/www/lead_info.sqlite`,
  path.normalize(`${__dirname}/../classes/model`)
);

build(
  `${__dirname}/lead_action.graphql`,
  ``,
  `${__dirname}/exports/lead_action.sql`,
  `${__dirname}/default/db/www/lead_action.sqlite`,
  path.normalize(`${__dirname}/../classes/model`)
);