const jwt = require('jsonwebtoken')
const config = require('../../config')
const User = require('../../models/user')

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

    const user = await User.findById(decodedToken.id)
    socket.userId = decodedToken.id
    socket.userName = user.userName
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = isAuth
