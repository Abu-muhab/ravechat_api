const jwt = require('jsonwebtoken')
const config = require('../config')

const userService = class UserService {
  constructor (UserModel) {
    this.UserModel = UserModel
  }

  async createUser ({ email, password }) {
    const existingUser = await this.UserModel.findOne({ email })

    if (existingUser) {
      throw Error('User Already exists')
    }

    const newUser = new this.UserModel({ email, password })

    await newUser.save()

    const { authToken } = await this.login({ email, password })

    return { user: newUser, authToken }
  }

  async authenticateWithSnapchat ({ avatarUrl, displayName, snapId }) {
    let user = await this.UserModel.findOne({ snapId }).select('-password')

    if (!user) {
      if (displayName === undefined || avatarUrl === undefined) {
        throw Error('Missing params')
      }
      user = new this.UserModel({ avatarUrl, displayName, snapId })
      await user.save()
    }

    const authToken = jwt.sign({
      id: user.id
    }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
    return { user, authToken }
  }

  async login ({ email, password }) {
    let user = await this.UserModel.findOne({ email })
    if (!user) {
      throw Error('Incorrect email or password')
    }

    const isCorrectPassword = await user.verifyPassword(password)
    if (!isCorrectPassword) {
      throw Error('Incorrect email or password')
    }

    const authToken = jwt.sign({
      id: user.id
    }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })

    user = user.toJSON()
    delete user.password
    return { user, authToken }
  }

  async findUserByGoogleIdOrEmail (email, googleId) {
    let user = await this.UserModel.findOne({ googleId }).select('-password')
    if (!user) {
      user = await this.UserModel.findOne({ email })
    }
    return user
  }
}

module.exports = userService
