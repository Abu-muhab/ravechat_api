const MessageHandler = require('../utils/message-handler')
const chatEventBus = require('../eventbus/chat')

exports.sendChat = new MessageHandler('new-chat', (message) => {
  console.log(message)
  chatEventBus.next({
    type: 'new-chat',
    targets: [message.userName],
    payload: {
      message: message.message
    }
  })
})
