Mongo  = require('diso.mongo')
Schema = Mongo.Schema

class Address extends Mongo.EmbeddedModel
  @schema({
    type  : Schema.String
    value : Schema.String
  })

Object.defineProperty(Address::, 'phone', {
  get : ()->
    numbers = @value.replace(/[^\d]+/g, '')
    "+1#{numbers}"
})

Object.defineProperty(Address::, 'email', {
  get : ()->
    @value
})

module.exports = Address
