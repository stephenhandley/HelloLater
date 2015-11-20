Express    = require('express')
BodyParser = require('body-parser')
Type       = require('type-of-is')

routes  = require('../routes')
Handler = require('../Handler')
log     = require('../log')

app = Express()
app.use(BodyParser.json())
app.use(Handler.error)

for route in routes
  {method, path, action} = route
  handler = Handler.run(action)
  app[method.toLowerCase()](path, handler)

port = process.env.PORT || 5000
app.listen(port)
log.info("Listening on #{port}")
