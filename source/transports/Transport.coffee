class Transport
  instances = {}

  @send : (message)->
    instances[@name] ||= new @()
    instance = instances[@name]
    instance.send(message)

  send : (args)->
    throw new Error("Transport must implement send method")

module.exports = Transport
