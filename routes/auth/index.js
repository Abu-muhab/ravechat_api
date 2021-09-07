const { Router } = require('express')
const users = require('./user')

const authRouter = Router()

authRouter.use('/users', users)

module.exports = authRouter
