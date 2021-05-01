/**
 * InitialEnquiry Model. Defining InitialEnquiry schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'InitialEnquiryModel'
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
      documents: {
        birthCertOrPassport: {
          type: String,
          required: true
        },
        schoolReport: {
          type: String,
          required: true
        },
        passportPhoto: {
          type: String,
          required: true
        }
      },
      studentInfo: {
        firstName: {
          type: String,
          required: true
        },
        surName: {
          type: String,
          required: true
        },
        middleName: {
          type: String,
          required: true
        },
        preferedName: {
          type: String,
          required: true
        },
        dob: {
          type: String,
          required: true
        },
        gender: {
          type: String,
          required: true
        },
        countryOfBirth: {
          type: String,
          required: true
        },
        nationality: {
          type: String,
          required: true
        },
        dualNationality: {
          type: String
        },
        firstLanguage: {
          type: String,
          required: true
        },
        homeLanguage: {
          type: String,
          required: true
        },
        religion: {
          type: String,
          required: true
        }
      }
    },
    {
      versionKey: false,
      timestamps: true
    }
  )

  schema.index({ applicant: 1 })

  return mongoose.model('InitialEnquiry', schema)
}
