(function() {
  var Async, Context, Message, find, getIds, log, send;

  Async = require('async');

  Context = require('cntxt');

  log = require('../log');

  Message = require('../models').Message;

  find = function(context) {
    log.info('findUnsent');
    return Message.findUnsent(context.wrap('messages'));
  };

  getIds = function(context) {
    var ids, messages;
    log.info('getIds');
    messages = context.data.messages;
    ids = messages.map(function(message) {
      return message._id;
    });
    return context.next({
      ids: ids
    });
  };

  send = function(context) {
    var item;
    log.info({
      ids: context.data.ids
    }, 'sending');
    item = function(message, next) {
      return message.send(next);
    };
    return Async.eachSeries(context.data.messages, item, context.wrap('sends'));
  };

  log.info('Starting send');

  Context.run([find, getIds, send]).done(function(context) {
    if (context.errored) {
      return log.error(context.error);
    } else {
      log.info('Done sending');
      return log.info({
        sends: context.data.sends
      });
    }
  });

}).call(this);
