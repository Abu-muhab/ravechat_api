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
      console.log('New connection')
      this.onConnect(socket)
    })
  };
}
module.exports = SocketRouter
