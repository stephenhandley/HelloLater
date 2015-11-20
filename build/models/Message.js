(function() {
  var Address, Message, Mongo, Schema,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Mongo = require('diso.mongo');

  Schema = Mongo.Schema;

  Address = require('./Address');

  Message = (function(superClass) {
    extend(Message, superClass);

    function Message() {
      return Message.__super__.constructor.apply(this, arguments);
    }

    Message.db_url = process.env.MONGO_URL;

    Message.schema({
      name: Schema.String,
      send_at: Schema.Date,
      address: Address
    });

    return Message;

  })(Mongo.Model);

  module.exports = Message;

}).call(this);
