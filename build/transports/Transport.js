(function() {
  var Transport;

  Transport = (function() {
    var instances;

    function Transport() {}

    instances = {};

    Transport.send = function(message) {
      var instance, name;
      instances[name = this.name] || (instances[name] = new this());
      instance = instances[this.name];
      return instance.send(message);
    };

    Transport.prototype.send = function(args) {
      throw new Error("Transport must implement send method");
    };

    return Transport;

  })();

  module.exports = Transport;

}).call(this);
