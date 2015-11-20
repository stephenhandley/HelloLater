(function() {
  var BodyParser, Express, Handler, Type, action, app, handler, i, len, log, method, path, port, route, routes;

  Express = require('express');

  BodyParser = require('body-parser');

  Type = require('type-of-is');

  routes = require('./routes');

  Handler = require('./Handler');

  log = require('./log');

  app = Express();

  app.use(BodyParser.json());

  app.use(Handler.error);

  for (i = 0, len = routes.length; i < len; i++) {
    route = routes[i];
    method = route.method, path = route.path, action = route.action;
    handler = Handler.run(action);
    app[method.toLowerCase()](path, handler);
  }

  port = process.env.PORT || 5000;

  app.listen(port);

  log.info("Listening on " + port);

}).call(this);
