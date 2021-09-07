const express = require('express')
const http = require('http')
const cors = require('cors')
const config = require('./config')
const mongoose = require('mongoose')

const apiRouter = require('./routes/api')
const authRouter = require('./routes/auth')

// connect to db
mongoose.connect(
  config.dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err) => {
    if (err) throw new Error('Error connecting to database')
    console.log('Connected to database')
  }
)

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', apiRouter)
app.use('/auth', authRouter)

// error handler
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: false,
    message: err.message,
    error: err.error
  })
})

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
