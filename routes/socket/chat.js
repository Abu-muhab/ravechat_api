const SocketRouter = require('../../utils/socket-router')
const chatHanlders = require('../../handlers/chat')
const MessageHandlers = require('../../utils/message-handlers')
const isAuth = require('../../middlewares/sockets/isAuth')

const chatRouter = new SocketRouter()

chatRouter.use('/chat', [isAuth], (socket) => {
  socket.on('message', message => {
    console.log(message)
    const handlers = new MessageHandlers({
      [chatHanlders.sendChat.type]: chatHanlders.sendChat
    })
    try {
      handlers.handle(message)
    } catch (err) {
      console.log(err.message)
    }
  })
})

module.exports = chatRouter
