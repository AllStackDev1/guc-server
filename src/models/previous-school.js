/**
 * Previous School Model. Defining Previous School schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'PreviousSchoolModel'
module.exports.dependencies = ['mongoose']
module.exports.factory = mongoose => {
  'use strict'

  const Schema = mongoose.Schema
  const ObjectId = Schema.Types.ObjectId

  // Define schema for Previous School Model
  const schema = new Schema(
    {
      applicant: {
        type: ObjectId,
        ref: 'Applicant',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      dateOfArrival: {
        type: Date,
        required: true
      },
      dateOfLeaving: {
        type: Date,
        required: true
      }
    },
    {
      versionKey: false,
      timestamps: true
    }
  )

  schema.index({ applicant: 1 })

  return mongoose.model('PreviousSchool', schema)
}
