class MessageHandlers {
  constructor (handlers) {
    this.handlers = handlers
  }

  handle (message) {
    let handler
    this.handlers.forEach(element => {
      if (element.type === message.type) {
        handler = element
      }
    })
    if (handler === undefined) {
      throw new Error('No handler found for this message')
    }
    handler.handle(message.message)
  }
}

module.exports = MessageHandlers
