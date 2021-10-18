const SocketRouter = require('../../utils/socket-router')
const chatHanlders = require('../../handlers/chat')
const MessageHandlers = require('../../utils/message-handlers')
const isAuth = require('../../middlewares/sockets/isAuth')
const { userServiceInstance } = require('../../services/index')
const chatEventBus = require('../../eventbus/chat')
const { v4 } = require('uuid')
const admin = require('firebase-admin')

const chatRouter = new SocketRouter()

chatRouter.use('/chat', [isAuth], async (socket) => {
  socket.join(socket.userName)

  const raveAdmin = await userServiceInstance.findUserByUserName('@abdulmalik')
  const user = await userServiceInstance.findUserByUserName(socket.userName)

  // send welcome message if new user
  if (raveAdmin !== undefined && user !== undefined && user.newUser === true) {
    let messageId = v4()
    let payload = {
      type: 'new-chat',
      senderDetails: raveAdmin,
      targets: [socket.userName],
      message: {
        content: 'Hello, Welcome to rave chat!',
        from: raveAdmin.userName,
        to: socket.userName,
        time: new Date().toISOString(),
        id: messageId
      }
    }

    // push notification
    let pushPayload = {
      data: {
        message_details: JSON.stringify(payload)
      }
    }
    admin.messaging().sendToDevice(user.fcmToken, pushPayload)

    // socket notification
    chatEventBus.next(payload)

    // :::::::::::::::::::::::::::::::::::::::::::::::::
    // message to myself
    messageId = v4()
    payload = {
      type: 'new-chat',
      senderDetails: user,
      targets: [raveAdmin.userName],
      message: {
        content: 'Hey, i just joined ravechat',
        from: user.userName,
        to: raveAdmin.userName,
        time: new Date().toISOString(),
        id: messageId
      }
    }

    pushPayload = {
      data: {
        message_details: JSON.stringify(payload)
      }
    }

    admin.messaging().sendToDevice(raveAdmin.fcmToken, pushPayload)
    chatEventBus.next(payload)

    user.newUser = false
    user.save()
  }

  socket.on('message', message => {
    const handlers = new MessageHandlers([
      chatHanlders.sendChat
    ])

    if (typeof message !== 'object') {
      message = JSON.parse(message)
    }
    try {
      handlers.handle(message)
    } catch (err) {
      console.log(err.message)
    }
  })
})

module.exports = chatRouter
