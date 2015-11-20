(function() {
  var Actions, Handler, Type, log;

  Type = require('type-of-is');

  Actions = require('./Actions');

  log = require('./log');

  Handler = (function() {
    var default_error, respond;

    function Handler() {}

    respond = function(response, body, status) {
      response.setHeader('Content-Type', 'application/json');
      return response.status(status).send(JSON.stringify(body));
    };

    default_error = [
      {
        error: 'Server Error'
      }, 500
    ];

    Handler.run = function(action_name) {
      var action;
      action = Actions[action_name];
      if (!Type(action, Function)) {
        throw new Error("No such action: " + action_name);
      }
      return (function(_this) {
        return function(request, response) {
          var send;
          log.info({
            request: request.originalUrl
          });
          send = function(context) {
            var body, ref, status;
            ref = (function() {
              switch (false) {
                case !context.succeeded:
                  return [context.data.result, 200];
                case !context.errored:
                  log.error(context.error.stack);
                  return default_error;
                case !context.failed:
                  return [
                    {
                      error: context.data.error.message
                    }, 200
                  ];
              }
            })(), body = ref[0], status = ref[1];
            log.info({
              state: context.state,
              status: status,
              body: body
            });
            return respond(response, body, status);
          };
          return action(request.body, send);
        };
      })(this);
    };

    Handler.error = function(error, request, response, next) {
      var body, status;
      log.error({
        error: error.message,
        stack: error.stack
      });
      body = default_error[0], status = default_error[1];
      if (Type(error, SyntaxError)) {
        body.error = 'Invalid JSON';
      }
      return respond(response, body, status);
    };

    return Handler;

  })();

  module.exports = Handler;

}).call(this);
