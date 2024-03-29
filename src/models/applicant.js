/**
 * Applicant Model. Defining Applicant schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'ApplicantModel'
module.exports.dependencies = [
  'mongoose',
  'jsonwebtoken',
  'lodash',
  'GenerateCode',
  'envs',
  'miscHelpers'
]
module.exports.factory = (mongoose, jwt, lodash, generateCode, getEnvs, helpers) => {
  'use strict'

  const Schema = mongoose.Schema
  const { pick, upperFirst } = lodash
  const { secret, expiresIn } = getEnvs
  const { PENDING, PAID } = helpers.Status

  // Define schema for Applicant Model
  const schema = new Schema(
    {
      code: {
        type: String,
        unique: true
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
        trim: true,
        type: String,
        lowercase: true,
        required: [true, 'Email is a required field']
      },
      phoneNumber: {
        type: String,
        unique: true,
        required: [true, 'phone number is a required field']
      },
      stage: {
        type: Number,
        default: 5,
        enum: [5, 6, 6.1, 6.2, 7, 8.1, 8.2, 9, 10, 11, 12, 13, 14, 15]
      },
      status: {
        type: String,
        default: PENDING,
        enum: [PENDING, PAID]
      },
      resultDoc: {
        type: String
      },
      formDoc: {
        type: String
      },
      isAdmitted: {
        type: Boolean,
        default: false
      },
      avatar: String
    },
    {
      versionKey: false,
      timestamps: true
    }
  )

  schema.index({ code: 1, phoneNumber: 1 })

  schema.pre('save', async function (next) {
    const applicant = this
    if (applicant.isModified('firstName') || applicant.isModified('lastName')) {
      applicant.firstName = upperFirst(applicant.firstName.toLowerCase())
      applicant.lastName = upperFirst(applicant.lastName.toLowerCase())
    }

    if (!applicant.code) {
      try {
        applicant.code = await Promise.resolve(
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
    const applicant = this
    const applicantObject = applicant.toObject()
    return pick(applicantObject, [
      '_id',
      'email',
      'code',
      'firstName',
      'lastName',
      'phoneNumber',
      'resultDoc',
      'formDoc',
      'isAdmitted',
      'createdAt',
      'status',
      'stage',
      'avatar'
    ])
  }

  schema.methods.generateAuthToken = function () {
    const applicant = this
    const data = Object.assign({}, applicant.toJSON())
    delete data.resultDoc
    delete data.formDoc
    return jwt.sign(data, secret, { expiresIn }).toString()
  }

  return mongoose.model('Applicant', schema)
}
