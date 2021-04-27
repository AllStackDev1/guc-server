/* eslint-disable space-before-function-paren */
/**
 * @summary Generate unique randomize keys.
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */
module.exports.name = 'GenerateCode'
module.exports.dependencies = ['async', 'CounterModel', 'logger']
module.exports.factory = (async, counter, logger) => {
  'use strict'

  const { waterfall } = async

  /**
   * @description This method makes use of the counter model to
   * generate unique counts
   * @param {String} sequenceName
   * @param {Function} next
   */
  return (sequenceName, next) => {
    waterfall(
      [
        function findDoc(next) {
          counter
            .find({ _id: sequenceName }, (err, existingDoc) => {
              if (err) {
                next(err, null)
                return
              }
              if (existingDoc.length === 1) {
                counter.findOneAndUpdate(
                  { _id: sequenceName },
                  { $inc: { seq: 1 } },
                  { new: true },
                  (err, doc) => {
                    if (err) next(err, null)
                    const count = doc.seq
                    next(null, count)
                  }
                )
              } else {
                counter
                  .create({ _id: sequenceName })
                  .then(() => {
                    findDoc(next)
                  })
                  .catch(err => {
                    if (err) next(err, null)
                    logger.debug(err)
                  })
              }
            })
            .limit(1)
        },
        function sendCount(count, next) {
          const newSeq = count
          next(null, newSeq)
        }
      ],
      function (err, result) {
        if (err) {
          next(err, null)
          logger.getLogger().error(err)
          return
        }
        if (('' + result).length < 6) {
          const len = 6 - ('' + result).length
          '0'.repeat(len)
          return next('0'.repeat(len) + result)
        } else {
          // TODO: send email
        }
        return next('' + result)
      }
    )
  }
}
