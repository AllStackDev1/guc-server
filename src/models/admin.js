/**
 * Admin Model. Defining Admin schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'AdminModel'
module.exports.dependencies = ['mongoose', 'bcryptjs', 'jsonwebtoken', 'lodash', 'envs']
module.exports.factory = (mongoose, bcrypt, jwt, lodash, getEnvs) => {
  'use strict'

  const Schema = mongoose.Schema
  const { pick, upperFirst } = lodash
  const { secret, expiresIn } = getEnvs

  // Define schema for Admin Model
  const schema = new Schema(
    {
      firstName: {
        type: String,
        required: [true, 'First name is a required field']
      },
      lastName: {
        type: String,
        required: [true, 'Last name is a required field']
      },
      email: {
        type: String,
        required: [true, 'Email is a required field'],
        unique: true,
        lowercase: true,
        trim: true
      },
      password: {
        type: String,
        required: [true, 'Password is a required field'],
        minlength: 8
      },
      avatar: String
    },
    {
      versionKey: false,
      timestamps: true
    }
  )

  schema.pre('save', function (next) {
    const admin = this
    if (admin.isModified('firstName') || admin.isModified('lastName')) {
      admin.firstName = upperFirst(admin.firstName.toLowerCase())
      admin.lastName = upperFirst(admin.lastName.toLowerCase())
    }
    if (admin.isModified('password')) {
      admin.password = bcrypt.hashSync(admin.password, bcrypt.genSaltSync(10))
    }
    next()
  })

  schema.methods.toJSON = function () {
    const admin = this
    const adminObject = admin.toObject()
    return pick(adminObject, ['_id', 'email', 'firstName', 'lastName', 'avatar'])
  }

  schema.methods.generateAuthToken = function (eIn) {
    const admin = this
    return jwt.sign(admin.toJSON(), secret, { expiresIn: eIn || expiresIn }).toString()
  }

  schema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
  }

  return mongoose.model('Admin', schema)
}
