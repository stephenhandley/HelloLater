Type = require('type-of-is')

Actions = require('./Actions')
log     = require('./log')

class Handler
  respond = (response, body, status)->
    response.setHeader('Content-Type', 'application/json')
    response.status(status).send(JSON.stringify(body))

  default_error = [{ error : 'Server Error' }, 500]

  isJsonParsingError = (error)->
    Type(error, SyntaxError) and (error.message is 'Unexpected end of input')

  @run: (action_name)->

    action = Actions[action_name]
    unless Type(action, Function)
      throw new Error("No such action: #{action_name}")

    (request, response)=>
      log.info(request : request.originalUrl)

      send = (context)=>
        [body, status] = switch
          when context.succeeded
            [context.data.result, 200]
          when context.errored
            log.error(context.error.stack)
            default_error
          when context.failed
            [{ error : context.data.error.message }, 200]

        log.info({
          state  : context.state
          status : status
          body   : body
        })

        respond(response, body, status)

      action(request.body, send)

  @error : (error, request, response, next)->
    log.error({
      error : error.message
      stack : error.stack
    })

    [body, status] = default_error

    if isJsonParsingError(error)
      body.error = 'Invalid JSON'

    respond(response, body, status)


module.exports = Handler
