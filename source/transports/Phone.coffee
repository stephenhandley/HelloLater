Twilio = require('twilio')

Transport = require('./Transport')
log       = require('../log')

class Phone extends Transport
  constructor : ()->
    env = process.env
    @client = new Twilio.RestClient(env.TWILIO_SID, env.TWILIO_TOKEN)

  send : (args)->
    {message, callback} = args

    payload = {
      to   : message.address.phone
      from : process.env.TWILIO_PHONE
      body : message.body
    }

    log.info(payload, 'sending sms')
    @client.messages.create(payload, callback)

module.exports = Phone
