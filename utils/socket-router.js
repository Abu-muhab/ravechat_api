const { userServiceInstance } = require('../services/index')
const chatEventBus = require('../eventbus/chat')

class SocketRouter {
  use (path, middlewares, onConnect) {
    this.path = path
    this.middlewares = middlewares
    this.onConnect = onConnect
  };

  bind (io) {
    this.middlewares.forEach(middleware => {
      io.of(this.path).use(middleware)
    })

    io.of(this.path).on('connection', async (socket) => {
      const raveAdmin = await userServiceInstance.findUserByUserName('@abdulmalik')
      const user = await userServiceInstance.findUserByUserName(socket.userName)

      if (raveAdmin !== undefined && user !== undefined) {
        // send welcome message of new user
        chatEventBus.next({
          type: 'new-chat',
          senderDetails: raveAdmin,
          targets: [socket.userName],
          message: {
            content: 'Welcome to rave chat',
            from: raveAdmin.userName,
            to: socket.userName,
            time: new Date().toISOString()
          }
        })
      }

      this.onConnect(socket)
    })
  };
}
module.exports = SocketRouter
