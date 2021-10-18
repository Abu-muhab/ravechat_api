const MessageHandler = require('../utils/message-handler')
const chatEventBus = require('../eventbus/chat')
const { userServiceInstance } = require('../services/index')
const admin = require('firebase-admin')
const { v4 } = require('uuid')

exports.sendChat = new MessageHandler('new-chat', async (message) => {
  const sender = await userServiceInstance.findUserByUserName(message.from)
  const receiver = await userServiceInstance.findUserByUserName(message.to)

  if (!sender || !receiver) return

  // TODO: refractor into notification service
  // send chat notification
  const notificationToken = receiver.fcmToken
  if (!notificationToken) return

  const messageId = v4()

  const payload = {
    message_details: JSON.stringify({
      type: 'new-chat',
      senderDetails: sender,
      targets: [message.to],
      message: Object.assign(message, { id: messageId })
    })
  }

  const pushPayload = {
    data: {
      message_details: JSON.stringify(payload)
    }
  }

  // send push notification
  admin.messaging().sendToDevice(notificationToken, pushPayload)

  // send socket message
  if (message.from !== message.to) {
    chatEventBus.next(payload)
  }
})
