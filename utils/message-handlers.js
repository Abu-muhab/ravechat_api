class MessageHandlers {
  constructor (handlers) {
    this.handlers = handlers
  }

  handle (message) {
    if (!this.handlers[message.type]) {
      throw new Error('No handler found for this message')
    }

    this.handlers[message.type].handle(message)
  }
}

module.exports = MessageHandlers
