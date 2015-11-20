Mongo  = require('diso.mongo')
Schema = Mongo.Schema

class Address extends Mongo.EmbeddedModel
  @schema({
    type  : Schema.String
    value : Schema.String
  })

module.exports = Address
