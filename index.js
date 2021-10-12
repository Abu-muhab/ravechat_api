const express = require('express')
const http = require('http')
const cors = require('cors')
const config = require('./config')
// const passportConfig = require('./config/passport')
const mongoose = require('mongoose')
const passport = require('passport')

const apiRouter = require('./routes/api')
const authRouter = require('./routes/auth')
const { Server } = require('socket.io')
const chatEventBus = require('./eventbus/chat')

const chatSocketRouter = require('./routes/socket/chat')

// configure passport
// passportConfig(passport)

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
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())
app.use(express.json())
app.use(passport.initialize())

app.use('/api', apiRouter)
app.use('/auth', authRouter)

// bind socket routes
chatSocketRouter.bind(io)

// bus event subcriptions
chatEventBus.subscribe(message => {
  message.targets.forEach(target => {
    io.of('/chat').to(target).emit('message', message)
  })
})

// error handler
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: false,
    message: err.message,
    error: err.error
  })
})

server.listen(config.port, '192.168.43.91', () => {
  console.log(`Server running on port ${config.port}`)
})

// server.listen(config.port, () => {
//   console.log(`Server running on port ${config.port}`)
// })
