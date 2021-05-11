/**
 * Download List Model. Defining Download List schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'DownloadListModel'
module.exports.dependencies = ['mongoose', 'mongoose-unique-validator']
module.exports.factory = (mongoose, uniqueValidator) => {
  'use strict'

  const Schema = mongoose.Schema
  const ObjectId = Schema.Types.ObjectId

  // Define schema for Download List Model
  const schema = new Schema(
    {
      applicant: {
        type: ObjectId,
        ref: 'Applicant',
        unique: true,
        required: true
      }
    },
    {
      versionKey: false,
      timestamps: true
    }
  )

  schema.index({ applicant: 1 })

  schema.plugin(uniqueValidator, { message: '{PATH} already added' })

  return mongoose.model('DownloadList', schema)
}
