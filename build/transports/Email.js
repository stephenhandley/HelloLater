(function() {
  var Email, Sendgrid, Transport, log,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Sendgrid = require('sendgrid');

  Transport = require('./Transport');

  log = require('../log');

  Email = (function(superClass) {
    extend(Email, superClass);

    function Email() {
      var env;
      env = process.env;
      this.client = Sendgrid(process.env.SENDGRID_API_KEY);
    }

    Email.prototype.send = function(args) {
      var callback, message, payload;
      message = args.message, callback = args.callback;
      payload = {
        to: message.address.email,
        from: process.env.SENDGRID_EMAIL,
        subject: message.body,
        text: message.body
      };
      log.info(payload, 'sending email', payload);
      return this.client.send(payload, callback);
    };

    return Email;

  })(Transport);

  module.exports = Email;

}).call(this);
