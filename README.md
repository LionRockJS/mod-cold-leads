# mod-cold-leads
The form to email module for LionRockJS, 
customize schema/lead_info for your own needs

## Installation
``npm i @lionrockjs/mod-cold-leads``

## Usage
1. Form post to route mapping to ControllerLead.action_update()
2. Form fields using ORMInput syntax and attributes[*lead_info*] for lead info customised fields.
3. Form field *destination* for thank you page redirection.
4. utm tracking fields are automatically captured and stored in the lead object if using ControllerLead.action_index() .
5. Greeting email will be sent to the lead if contact type "email" is present.
6. support json response for thank you page and duplicate page.

## routes
```
RouteList.add(Central.config.language.route + '/registration/verify', 'controller/Lead', 'verify', 'POST');
RouteList.add(Central.config.language.route + '/registration/create', 'controller/Lead', 'update', 'POST');
RouteList.add(Central.config.language.route + '/registration/thank-you', 'controller/Lead', 'thank_you');
RouteList.add(Central.config.language.route + '/registration/thank-you/:sign', 'controller/Lead', 'thank_you');
RouteList.add(Central.config.language.route + '/registration/thank-you.json', 'controller/Lead', 'thank_you_json');
RouteList.add(Central.config.language.route + '/registration/duplicate', 'controller/Lead', 'duplicate');
RouteList.add(Central.config.language.route + '/registration/duplicate.json', 'controller/Lead', 'duplicate_json');
RouteList.add(Central.config.language.route + '/edm/view/:template', 'controller/Edm', 'view');

```