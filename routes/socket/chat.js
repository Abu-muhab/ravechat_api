const SocketRouter = require('../../utils/socket-router')
const chatHanlders = require('../../handlers/chat')
const MessageHandlers = require('../../utils/message-handlers')
const isAuth = require('../../middlewares/sockets/isAuth')

const chatRouter = new SocketRouter()

chatRouter.use('/chat', [isAuth], (socket) => {
  socket.join(socket.userName)
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
