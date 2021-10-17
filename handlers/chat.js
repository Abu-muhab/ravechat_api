const MessageHandler = require('../utils/message-handler')
const chatEventBus = require('../eventbus/chat')
const { userServiceInstance } = require('../services/index')
const admin = require('firebase-admin')

exports.sendChat = new MessageHandler('new-chat', async (message) => {
  const sender = await userServiceInstance.findUserByUserName(message.from)
  const receiver = await userServiceInstance.findUserByUserName(message.to)

  if (!sender || !receiver) return

  // TODO: refractor into notification service
  // send chat notification
  const notificationToken = receiver.fcmToken
  if (!notificationToken) return

  const payload = {
    notification: {
      title: 'test',
      body: 'test test test'
    },
    data: {
      screen: 'sales_dashboard',
      title: 'New order!',
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
      body: 'test'
    }
  }

  await admin.messaging().sendToDevice(notificationToken, payload)

  if (message.from !== message.to) {
    chatEventBus.next({
      type: 'new-chat',
      senderDetails: sender,
      targets: [message.to],
      message
    })
  }
})
