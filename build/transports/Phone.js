(function() {
  var Phone, Transport, Twilio, log,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Twilio = require('twilio');

  Transport = require('./Transport');

  log = require('../log');

  Phone = (function(superClass) {
    extend(Phone, superClass);

    function Phone() {
      var env;
      env = process.env;
      this.client = new Twilio.RestClient(env.TWILIO_SID, env.TWILIO_TOKEN);
    }

    Phone.prototype.send = function(args) {
      var callback, message, payload;
      message = args.message, callback = args.callback;
      payload = {
        to: message.address.phone,
        from: process.env.TWILIO_PHONE,
        body: message.body
      };
      log.info(payload, 'sending sms');
      return this.client.messages.create(payload, callback);
    };

    return Phone;

  })(Transport);

  module.exports = Phone;

}).call(this);
