const MessageHandler = require('../utils/message-handler')
const chatEventBus = require('../eventbus/chat')
const { userServiceInstance } = require('../services/index')

exports.sendChat = new MessageHandler('new-chat', async (message) => {
  const sender = await userServiceInstance.findUserByUserName(message.from)
  if (message.from !== message.to) {
    chatEventBus.next({
      type: 'new-chat',
      senderDetails: sender,
      targets: [message.to],
      message
    })
  }
})
