const { Router } = require('express')
const userRouter = require('./user')

const apiRouter = Router()

apiRouter.use('/users', userRouter)

module.exports = apiRouter
