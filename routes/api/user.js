const { Router } = require('express')
const userController = require('../../controllers/api/user')
const { query } = require('express-validator')

const userRouter = Router()

userRouter.get('/search', [
  query('limit').isNumeric(),
  query('page').isNumeric(),
  query('query').notEmpty()
], userController.searchUser)

module.exports = userRouter
