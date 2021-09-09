const bcrypt = require('bcryptjs')
const { model, Schema } = require('mongoose')

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    googleId: String
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

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(user.password, 12)
    user.password = hashedPassword
  } catch (err) {
    return next(err)
  }
})

module.exports = model('User', userSchema)
