/**
 * User Model. Defining User schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created Nov 11, 2020
 */

module.exports.name = 'UserModel'
module.exports.dependencies = ['mongoose', 'bcryptjs', 'jsonwebtoken', 'lodash']
module.exports.factory = (mongoose, bcrypt, jwt, lodash) => {
  'use strict'

  const Schema = mongoose.Schema
  const { pick, upperFirst } = lodash

  // Define schema for User
  const schema = new Schema(
    {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },
      password: {
        type: String,
        required: true,
        minlength: 8
      },
      photoUrl: {
        type: String
      },
      avatar: [
        {
          _id: false,
          access: {
            type: String,
            required: true
          },
          token: {
            type: String,
            required: true
          }
        }
      ],
      isVerified: {
        type: Boolean,
        default: false
      }
    },
    {
      versionKey: false,
      timestamps: true,
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
      }
    }
  )

  schema.pre('save', function (next) {
    let user = this
    if (user.isModified('firstName') || user.isModified('lastName')) {
      user.firstName = upperFirst(user.firstName.toLowerCase())
      user.lastName = upperFirst(user.lastName.toLowerCase())
    }
    if (user.isModified('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
    }
    next()
  })

  schema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    return pick(userObject, ['_id', 'email', 'email', 'firstName', 'lastName', 'avatar'])
  }

  schema.methods.generateAuthToken = function (access, expiresIn) {
    let user = this
    let token = jwt
      .sign({ _id: user._id.toHexString(), access }, envs.jwtSecret, {
        expiresIn: expiresIn || envs.jwtExpiresIn
      })
      .toString()
    user.tokens.push({ access, token })
    return user.save().then(() => {
      return token
    })
  }

  schema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
  }

  return mongoose.model('User', schema)
}
