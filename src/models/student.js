/**
 * Student Model. Defining Student schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created Nov 11, 2020
 */

module.exports.name = 'StudentModel'
module.exports.dependencies = ['mongoose', 'jsonwebtoken', 'lodash', 'GenerateKey', 'envs']
module.exports.factory = (mongoose, jwt, lodash, generateCode, getEnvs) => {
  'use strict'

  const Schema = mongoose.Schema
  const { pick, upperFirst } = lodash
  const { secret, expiresIn } = getEnvs(process.env.NODE_ENV)

  // Define schema for Student Model
  const schema = new Schema(
    {
      code: {
        type: String
      },
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
      phoneNumber: {
        type: String,
        required: [true, 'phone number is a required field']
      },
      avatar: String
    },
    {
      versionKey: false,
      timestamps: true
    }
  )

  schema.pre('save', async function (next) {
    const student = this
    if (student.isModified('firstName') || student.isModified('lastName')) {
      student.firstName = upperFirst(student.firstName.toLowerCase())
      student.lastName = upperFirst(student.lastName.toLowerCase())
    }

    if (!student.code) {
      try {
        student.code = await Promise.resolve(
          new Promise((resolve, reject) => {
            generateCode('gcu', code => {
              if (!code) reject(new Error('Unable to generate new code'))
              resolve(code)
            })
          })
        )
      } catch (error) {
        next(error)
      }
    }

    next()
  })

  schema.methods.toJSON = function () {
    const student = this
    const studentObject = student.toObject()
    return pick(studentObject, ['_id', 'email', 'code', 'firstName', 'lastName', 'avatar'])
  }

  schema.methods.generateToken = function () {
    const student = this
    return jwt.sign(student, secret, { expiresIn }).toString()
  }

  return mongoose.model('Student', schema)
}
