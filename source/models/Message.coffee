Mongo  = require('diso.mongo')
Schema = Mongo.Schema

Address = require('./Address')

class Message extends Mongo.Model
  @db_url : process.env.MONGO_URL

  @schema({
    name    : Schema.String
    send_at : Schema.Date
    address : Address
  })

module.exports = Message
