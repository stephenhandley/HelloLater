Async = require('async')
Context = require('cntxt')

log     = require('../log')
Message = require('../models').Message

find = (context)->
  log.info('findUnsent')
  Message.findUnsent(context.wrap('messages'))

getIds = (context)->
  log.info('getIds')
  messages = context.data.messages
  ids = messages.map((message)->
    message._id
  )

  context.next({
    ids : ids
  })

send = (context)->
  log.info({ids : context.data.ids }, 'sending')

  item = (message, next)->
    message.send(next)

  Async.eachSeries(context.data.messages, item, context.wrap('sends'))

log.info('Starting send')

Context.run([
  find,
  getIds,
  send
]).done((context)->
  if context.errored
    log.error(context.error)
  else
    log.info('Done sending')
    log.info(sends : context.data.sends)
)
