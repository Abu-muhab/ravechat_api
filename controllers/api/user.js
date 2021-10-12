const { validationResult } = require('express-validator')
const { userServiceInstance } = require('../../services')

exports.searchUser = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next({
        statusCode: 400,
        message: 'Invalid params',
        error: errors.array()
      })
    }

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const query = req.query.query

    const { hasNextPage, users, lastPage } = await userServiceInstance.findUser({ page, limit, query })

    res.status(200).json({
      status: true,
      data: {
        currentPage: page,
        lastPage,
        hasNextPage,
        users
      }
    })
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    })
  }
}
