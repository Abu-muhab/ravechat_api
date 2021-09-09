const { Router } = require('express')
const usersAuthController = require('../../controllers/auth/user')
const { body } = require('express-validator')
const passport = require('passport')

const router = Router()

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], usersAuthController.login)

router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], usersAuthController.signUp)

// router.get('/google', passport.authenticate('google', {
//   session: false,
//   scope: ['profile', 'email']
// }))

// router.get('/google/redirect', (req, res, next) => {
//   console.log(req.headers)
//   next()
// }, passport.authenticate('google', { session: false }), (req, res) => {
//   res.send(req.user)
// })

module.exports = router
