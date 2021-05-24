/**
 * HealthAndMedical Model. Defining HealthAndMedical schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'HealthAndMedicalModel'
module.exports.dependencies = ['mongoose']
module.exports.factory = mongoose => {
  'use strict'

  const Schema = mongoose.Schema
  const ObjectId = Schema.Types.ObjectId

  // Define schema for Health And Medical Model
  const schema = new Schema(
    {
      applicant: {
        type: ObjectId,
        ref: 'Applicant',
        unique: true,
        required: true
      },
      asthma: {
        type: Boolean,
        default: false
      },
      allergies: {
        type: Boolean,
        default: false
      },
      diabetes: {
        type: Boolean,
        default: false
      },
      epilepsy: {
        type: Boolean,
        default: false
      },
      others: {
        type: Boolean,
        default: false
      },
      notApplicable: {
        type: Boolean,
        default: false
      },
      immuneFile: {
        type: String
      },
      requireMedicalPlan: {
        type: String,
        required: true
      },
      takeRegularMedication: {
        type: String,
        required: true
      },
      dietaryRestriction: {
        type: String,
        required: true
      },
      physicalRestriction: {
        type: String,
        required: true
      },
      otherMedicalIssues: {
        type: String,
        required: true
      },
      isImmunised: {
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

  return mongoose.model('HealthAndMedical', schema)
}
