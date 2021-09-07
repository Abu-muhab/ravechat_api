const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '../config.env') })

const config = {
  dbUrl: process.env.DB_URL,
  port: process.env.PORT,
  jwt: {
    secret: process.env.SECRET,
    expiresIn: process.env.JWT_EXPIRATION
  }
}

module.exports = config
