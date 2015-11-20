Context    = require('cntxt')
Type       = require('type-of-is')
PhoneRegex = require('phone-regex')
EmailRegex = require('email-regex')

Message = require('./models').Message
log     = require('./log')

module.exports = {
  create: (params, send)->
    requireParams = (context)->
      log.info('requireParams')

      for param in ['name', 'send_at']
        unless param of params
          return context.fail("Missing param: #{param}")

      context.next(params)

    processSendAt = (context)->
      log.info('processSendAt')

      timestamp = Date.parse(params.send_at)
      if isNaN(timestamp)
        return context.fail('send_at is not valid')

      send_at = new Date(params.send_at)
      now = new Date()

      unless send_at > now
        return context.fail('send_at is in the past')

      context.next({
        send_at : send_at
      })

    processAddress = (context)->
      log.info('processAddress')

      unless 'address' of context.data
        return context.next()

      address = context.data.address

      [type, value] = if PhoneRegex(exact : true).test(address)
        ['phone', address]
      else if EmailRegex(exact : true).test(address)
        ['email', address]
      else
        [null, null]

      unless type
        return context.fail('address is not valid phone or email')

      context.next({
        address : {
          type  : type
          value : value
        }
      })

    create = (context)->
      log.info('create', context.data)
      Message.insert(
        data     : context.data,
        callback : (error, messages)->
          if error
            context.error(error)
          else
            context.next({
              result : {
                message : messages[0].data()
              }
            })
      )

    Context.run([
      requireParams,
      processSendAt,
      processAddress,
      create
    ]).done(send)

  list: (params, send)->
    find = (context)->
      log.info('find')

      Message.findAll(
        callback : context.wrap('messages')
      )

    format = (context)->
      log.info('format')

      messages = context.data.messages.map((message)->
        message.data()
      )

      context.next({
        result: {
          messages : messages
        }
      })

    Context.run([
      find,
      format
    ]).done(send)
}
