import { Central } from '@lionrockjs/central';
import { RouteList } from '@lionrockjs/router';

RouteList.add(Central.config.language.route + '/registration/verify', 'controller/Lead', 'verify', 'POST');
RouteList.add(Central.config.language.route + '/registration/create', 'controller/Lead', 'update', 'POST');
RouteList.add(Central.config.language.route + '/registration/thank-you', 'controller/Lead', 'thank_you');
RouteList.add(Central.config.language.route + '/registration/thank-you/:sign', 'controller/Lead', 'thank_you');
RouteList.add(Central.config.language.route + '/registration/thank-you.json', 'controller/Lead', 'thank_you_json');
RouteList.add(Central.config.language.route + '/registration/duplicate', 'controller/Lead', 'duplicate');
RouteList.add(Central.config.language.route + '/registration/duplicate.json', 'controller/Lead', 'duplicate_json');
RouteList.add(Central.config.language.route + '/edm/view/:template', 'controller/Edm', 'view');