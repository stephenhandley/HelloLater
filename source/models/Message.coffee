Mongo  = require('diso.mongo')
Schema = Mongo.Schema

Address    = require('./Address')
transports = require('../transports')
log        = require('../log')

class Message extends Mongo.Model
  @db_url : process.env.MONGO_URL

  @schema({
    name    : Schema.String
    send_at : Schema.Date
    address : Address
    sent    : Schema.Boolean
  })

  @findUnsent : (callback)->
    now = new Date()

    query = {
      sent    : false
      send_at : {
        $lte : now
      }
    }

    @find(
      query    : query
      callback : callback
    )

  send : (callback)->
    unless @address
      callback(null, { message : 'no address, not sending' })

    type = @address.type
    type = type[0].toUpperCase() + type.slice(1)
    Transport = transports[type]

    log.info({ message : @, transport : Transport.name }, 'sending message')
    Transport.send(
      message  : @,
      callback : (error, receipt)=>
        @update(
          update : {
            $set : {
              sent : true
            }
          },
          callback : (error)->
            if (error)
              log.error(error)
            else
              log.info('sent message')

            callback(error, receipt)
        )
    )

Object.defineProperty(Message::, 'body', {
  get : ()->
    "Hello #{@name}"
})

module.exports = Message
