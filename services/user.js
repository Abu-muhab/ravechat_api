const jwt = require('jsonwebtoken')
const config = require('../config')

const userService = class UserService {
  constructor (UserModel) {
    this.UserModel = UserModel
  }

  async getUniqueUserName (name) {
    name = '@' + name.trim().split(' ')[0].toLowerCase()
    let existingUser = await this.UserModel.findOne({ userName: name })
    if (!existingUser) return name.toLowerCase()
    let randomName
    while (randomName === undefined) {
      const numberToAppend = Math.floor(Math.random() * 100000) + 1
      existingUser = await this.UserModel.findOne({ userName: name + String(numberToAppend) })
      if (!existingUser) {
        randomName = name + String(numberToAppend)
      }
    }
    return randomName.toLowerCase()
  }

  async createUser ({ email, name, password }) {
    const existingUser = await this.UserModel.findOne({ email })

    if (existingUser) {
      throw Error('User Already exists')
    }

    const newUser = new this.UserModel({ email, password, userName: await this.getUniqueUserName(name) })

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
      user = new this.UserModel({ avatarUrl, displayName, snapId, userName: await this.getUniqueUserName(displayName) })
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
