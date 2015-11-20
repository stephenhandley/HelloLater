(function() {
  var Context, EmailRegex, Message, PhoneRegex, Type, log;

  Context = require('cntxt');

  Type = require('type-of-is');

  PhoneRegex = require('phone-regex');

  EmailRegex = require('email-regex');

  Message = require('./models').Message;

  log = require('./log');

  module.exports = {
    create: function(params, send) {
      var checkParams, create, processAddress, processSendAt;
      checkParams = function(context) {
        var i, len, param, ref;
        log.info('requireParams');
        ref = ['name', 'send_at'];
        for (i = 0, len = ref.length; i < len; i++) {
          param = ref[i];
          if (!(param in params)) {
            return context.fail("Missing param: " + param);
          }
        }
        params.sent = false;
        return context.next(params);
      };
      processSendAt = function(context) {
        var now, send_at, timestamp;
        log.info('processSendAt');
        timestamp = Date.parse(params.send_at);
        if (isNaN(timestamp)) {
          return context.fail('send_at is not valid');
        }
        send_at = new Date(params.send_at);
        now = new Date();
        return context.next({
          send_at: send_at
        });
      };
      processAddress = function(context) {
        var address, ref, type, value;
        log.info('processAddress');
        if (!('address' in context.data)) {
          return context.next();
        }
        address = context.data.address;
        ref = PhoneRegex({
          exact: true
        }).test(address) ? ['phone', address] : EmailRegex({
          exact: true
        }).test(address) ? ['email', address] : [null, null], type = ref[0], value = ref[1];
        if (!type) {
          return context.fail('address is not valid phone or email');
        }
        return context.next({
          address: {
            type: type,
            value: value
          }
        });
      };
      create = function(context) {
        log.info('create', context.data);
        return Message.insert({
          data: context.data,
          callback: function(error, messages) {
            if (error) {
              return context.error(error);
            } else {
              return context.next({
                result: {
                  message: messages[0].data()
                }
              });
            }
          }
        });
      };
      return Context.run([checkParams, processSendAt, processAddress, create]).done(send);
    },
    list: function(params, send) {
      var find, format;
      find = function(context) {
        log.info('find');
        return Message.findAll({
          callback: context.wrap('messages')
        });
      };
      format = function(context) {
        var messages;
        log.info('format');
        messages = context.data.messages.map(function(message) {
          return message.data();
        });
        return context.next({
          result: {
            messages: messages
          }
        });
      };
      return Context.run([find, format]).done(send);
    }
  };

}).call(this);
