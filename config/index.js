const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '../config.env') })

const config = {
  dbUrl: process.env.DB_URL,
  port: process.env.PORT,
  env: process.env.ENV ?? 'prod',
  jwt: {
    secret: process.env.SECRET,
    expiresIn: process.env.JWT_EXPIRATION
  },
  oAuth: {
    google: {
      clientID: process.env.GOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
}

module.exports = config
