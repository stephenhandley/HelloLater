(function() {
  var Address, Mongo, Schema,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Mongo = require('diso.mongo');

  Schema = Mongo.Schema;

  Address = (function(superClass) {
    extend(Address, superClass);

    function Address() {
      return Address.__super__.constructor.apply(this, arguments);
    }

    Address.schema({
      type: Schema.String,
      value: Schema.String
    });

    return Address;

  })(Mongo.EmbeddedModel);

  Object.defineProperty(Address.prototype, 'phone', {
    get: function() {
      var numbers;
      numbers = this.value.replace(/[^\d]+/g, '');
      return "+1" + numbers;
    }
  });

  Object.defineProperty(Address.prototype, 'email', {
    get: function() {
      return this.value;
    }
  });

  module.exports = Address;

}).call(this);
