Sendgrid = require('sendgrid')

Transport = require('./Transport')
log       = require('../log')

class Email extends Transport
  constructor : ()->
    env = process.env
    @client = Sendgrid(process.env.SENDGRID_API_KEY)

  send : (args)->
    {message, callback} = args

    payload = {
      to      : message.address.email
      from    : process.env.SENDGRID_EMAIL
      subject : message.body
      text    : message.body
    }

    log.info(payload, 'sending email', payload)
    @client.send(payload, callback)

module.exports = Email
