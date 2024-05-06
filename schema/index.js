import url from "node:url";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import path from 'node:path';
import { build } from '@lionrockjs/start';

build(
  `${__dirname}/lead.graphql`,
  `${__dirname}/lead.mjs`,
  `${__dirname}/exports/lead.sql`,
  `${__dirname}/default/db/www/lead.sqlite`,
  path.normalize(`${__dirname}/model`)
);

build(
  `${__dirname}/lead_info.graphql`,
  ``,
  `${__dirname}/exports/lead_info.sql`,
  `${__dirname}/default/db/www/lead_info.sqlite`,
  path.normalize(`${__dirname}/model`)
);

build(
  `${__dirname}/lead_action.graphql`,
  ``,
  `${__dirname}/exports/lead_action.sql`,
  `${__dirname}/default/db/www/lead_action.sqlite`,
  path.normalize(`${__dirname}/model`)
);