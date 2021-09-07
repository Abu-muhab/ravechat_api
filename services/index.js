const UserModel = require('../models/user')

const UserService = require('./user')

const userServiceInstance = new UserService(UserModel)

module.exports = {
  userServiceInstance
}
