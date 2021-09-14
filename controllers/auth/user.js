const { userServiceInstance } = require('../../services')
const { validationResult } = require('express-validator')

exports.signUp = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next({
        statusCode: 400,
        message: 'Invalid params',
        error: errors.array()
      })
    }

    const { user, authToken } = await userServiceInstance.createUser(req.body)
    res.status(200).json({
      status: true,
      data: {
        user,
        authToken
      }
    })
  } catch (error) {
    return next({
      statusCode: 400,
      message: error.message
    })
  }
}

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next({
        statusCode: 400,
        message: 'Invalid params',
        error: errors.array()
      })
    }

    const { user, authToken } = await userServiceInstance.login(req.body)
    res.status(200).json({
      status: true,
      data: {
        user,
        authToken
      }
    })
  } catch (error) {
    return next({
      statusCode: 400,
      message: error.message
    })
  }
}

exports.snapchatAuth = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next({
        statusCode: 400,
        message: 'Invalid params',
        error: errors.array()
      })
    }

    const { user, authToken } = await userServiceInstance.authenticateWithSnapchat(req.body)
    res.status(200).json({
      status: true,
      data: {
        user,
        authToken
      }
    })
  } catch (error) {
    return next({
      statusCode: 400,
      message: error.message
    })
  }
}
