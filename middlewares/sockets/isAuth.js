const jwt = require('jsonwebtoken')
const config = require('../../config')
const isAuth = async (socket, next) => {
  try {
    const authToken = socket.handshake.auth.authToken

    if (!authToken) {
      return next(new Error('No api key provided'))
    }

    let decodedToken
    try {
      decodedToken = jwt.verify(authToken, config.jwt.secret)
    } catch (err) {
      return next(new Error('Not Authenticated'))
    }
    if (!decodedToken) {
      return next(new Error('Not Authenticated'))
    }
    socket.userId = decodedToken.id
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = isAuth
