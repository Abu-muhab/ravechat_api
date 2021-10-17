const bcrypt = require('bcryptjs')
const { model, Schema } = require('mongoose')

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true
    },
    snapId: {
      type: String,
      trim: true
    },
    avatarUrl: {
      type: String,
      trim: true
    },
    displayName: {
      type: String,
      trim: true
    },
    userName: {
      type: String,
      trim: true,
      unique: true
    },
    password: {
      type: String
    },
    fcmToken: {
      type: String
    }
  },
  { timestamps: true })

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.pre('save', async function (next) {
  const user = this

  if (!user.isModified('password')) {
    return next()
  }

  if (!user.password) {
    return next()
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(user.password, 12)
    user.password = hashedPassword
  } catch (err) {
    return next(err)
  }
})

module.exports = model('User', userSchema)
