(function() {
  var Address, Message, Mongo, Schema, log, transports,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Mongo = require('diso.mongo');

  Schema = Mongo.Schema;

  Address = require('./Address');

  transports = require('../transports');

  log = require('../log');

  Message = (function(superClass) {
    extend(Message, superClass);

    function Message() {
      return Message.__super__.constructor.apply(this, arguments);
    }

    Message.db_url = process.env.MONGO_URL;

    Message.schema({
      name: Schema.String,
      send_at: Schema.Date,
      address: Address,
      sent: Schema.Boolean
    });

    Message.findUnsent = function(callback) {
      var now, query;
      now = new Date();
      query = {
        sent: false,
        send_at: {
          $lte: now
        }
      };
      return this.findAll({
        query: query,
        callback: callback
      });
    };

    Message.prototype.send = function(callback) {
      var Transport, type;
      if (!this.address) {
        callback(null, {
          message: 'no address, not sending'
        });
      }
      type = this.address.type;
      type = type[0].toUpperCase() + type.slice(1);
      Transport = transports[type];
      log.info({
        message: this,
        transport: Transport.name
      }, 'sending message');
      return Transport.send({
        message: this,
        callback: (function(_this) {
          return function(error, receipt) {
            return _this.update({
              update: {
                $set: {
                  sent: true
                }
              },
              callback: function(error) {
                if (error) {
                  log.error(error);
                } else {
                  log.info('sent message');
                }
                return callback(error, receipt);
              }
            });
          };
        })(this)
      });
    };

    return Message;

  })(Mongo.Model);

  Object.defineProperty(Message.prototype, 'body', {
    get: function() {
      return "Hello " + this.name;
    }
  });

  module.exports = Message;

}).call(this);
