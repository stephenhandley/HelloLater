(function() {
  var Bunyan;

  Bunyan = require('bunyan');

  module.exports = Bunyan.createLogger({
    name: 'HelloLater'
  });

}).call(this);
