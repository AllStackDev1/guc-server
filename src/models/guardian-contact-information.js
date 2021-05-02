/**
 * GuardianContactInformation Model. Defining GuardianContactInformation schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'GuardianContactInformationModel'
module.exports.dependencies = ['mongoose']
module.exports.factory = mongoose => {
  'use strict'

  const Schema = mongoose.Schema
  const ObjectId = Schema.Types.ObjectId

  // Define schema for Initial Enquiry Model
  const schema = new Schema(
    {
      applicant: {
        type: ObjectId,
        ref: 'Applicant',
        unique: true,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      familyName: {
        type: String,
        required: true
      },
      firstName: {
        type: String,
        required: true
      },
      relation: {
        type: String,
        required: true
      },
      occupation: {
        type: String,
        required: true
      },
      addressOne: {
        type: String,
        required: true
      },
      addressTwo: {
        type: String
      },
      homeNumber: {
        type: String
      },
      workNumber: {
        type: String
      },
      permissions: {
        type: String,
        required: true
      },
      hearAboutUs: {
        type: String,
        required: true
      },
      mobileNumber: {
        type: String,
        required: true
      },
      homeLanguage: {
        type: String,
        required: true
      },
      studentAddress: {
        type: String,
        required: true
      }
    },
    {
      versionKey: false,
      timestamps: true
    }
  )

  schema.index({ applicant: 1 })

  return mongoose.model('GuardianContactInformation', schema)
}
