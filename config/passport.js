const GooogleStrategy = require('passport-google-oauth20').Strategy
const config = require('./index')
const { userServiceInstance } = require('../services')
const User = require('../models/user')

module.exports = function (passport) {
  passport.use(new GooogleStrategy({
    clientID: config.oAuth.google.clientID,
    clientSecret: config.oAuth.google.clientSecret,
    callbackURL: '/auth/users/google/redirect'
  }, async (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    const user = await userServiceInstance.findUserByGoogleIdOrEmail(profile._json.email, profile.id)

    if (user) {
      done(null, user)
    } else {
      const user = await userServiceInstance.createUser({ email: profile._json.email, password: 'staticvoid', googleId: profile.id })
      done(null, user)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user)
  })
}
