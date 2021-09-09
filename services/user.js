const jwt = require('jsonwebtoken')
const config = require('../config')

const userService = class UserService {
  constructor (UserModel) {
    this.UserModel = UserModel
  }

  async createUser ({ email, password, googleId }) {
    const existingUser = await this.UserModel.findOne({ email })

    if (existingUser) {
      throw Error('User Already exists')
    }

    const newUser = new this.UserModel({ email, password, googleId })

    await newUser.save()

    const { authToken } = await this.login({ email, password })

    return { user: newUser, authToken }
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
      email: user.email,
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
