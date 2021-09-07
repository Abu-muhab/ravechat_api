const { Router } = require('express')
const usersAuthController = require('../../controllers/auth/user')
const { body } = require('express-validator')

const router = Router()

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], usersAuthController.login)

router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], usersAuthController.signUp)

module.exports = router
