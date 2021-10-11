const SocketRouter = require('../../utils/socket-router')
const chatHanlders = require('../../handlers/chat')
const MessageHandlers = require('../../utils/message-handlers')

const chatRouter = new SocketRouter()

chatRouter.use('/chat', [], (socket) => {
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

  socket.on('connection', () => {
    console.log('client connected')
  })
})

module.exports = chatRouter
