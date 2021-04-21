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
        default: 5101
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

  return mongoose.model('Counter', schema)
}
