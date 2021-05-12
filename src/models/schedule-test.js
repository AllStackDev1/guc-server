/**
 * Download List Model. Defining Download List schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'ScheduleTestModel'
module.exports.dependencies = ['mongoose', 'mongoose-unique-validator']
module.exports.factory = (mongoose, uniqueValidator) => {
  'use strict'

  const Schema = mongoose.Schema

  // Define schema for Download List Model
  const schema = new Schema(
    {
      code: {
        type: String,
        ref: 'Applicant',
        unique: true,
        required: true
      },
      accessCode: {
        type: String,
        required: true
      },
      examDate: {
        type: Date,
        required: true
      },
      resultDoc: {
        type: String
      },
      status: {
        type: String,
        default: 'Scheduled',
        enum: ['Scheduled', 'Completed']
      }
    },
    {
      versionKey: false,
      timestamps: true
    }
  )

  schema.index({ applicant: 1 })

  schema.plugin(uniqueValidator, { message: '{PATH} already added' })

  return mongoose.model('ScheduleTest', schema)
}
