/* eslint-disable space-before-function-paren */
/**
 * Counter Model. Defining order schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

module.exports.name = 'CounterModel'
module.exports.dependencies = ['mongoose']
module.exports.factory = mongoose => {
  'use strict'

  const Schema = mongoose.Schema
  const schema = new Schema(
    {
      _id: {
        type: String,
        required: true
      },
      seq: {
        type: Number,
        default: 100000
      }
    },
    {
      versionKey: false,
      timestamps: true
    }
  )

  return mongoose.model('Counter', schema)
}
