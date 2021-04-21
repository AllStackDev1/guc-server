/* eslint-disable no-useless-constructor */
/* eslint-disable space-before-function-paren */
'use strict'
const BaseRepository = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @description This class extends the BaseRepository class.
 * This is a dependency for the UserController class.
 */
module.exports.name = 'UserRepository'
module.exports.dependencies = ['UserModel', 'passport-config', 'logger']
module.exports.factory = class extends BaseRepository {
  /**
   * @param { object } model mongodb model which provides the db drive methods.
   * @param {{ debug: Function }} logger - Logger object
   */
  constructor(model, passportConfig, logger) {
    super(model, logger)
  }

  /**
   * Removes an invalid token from a specific user's document.
   * @param {string} id string of a user.
   * @param {[]} token to be removed.
   * @return void.
   */
  async destroyToken(id, token) {
    try {
      return await this.userModel.findByIdAndUpdate(id, { $pull: { tokens: { token } } })
    } catch (error) {
      logger.error(error)
    }
  }

  /**
   * Authenticate a user.
   * @param {[]} req request for passport authentication.
   * @return Returns the authenticated user's document.
   */
  auth(req) {
    return new Promise((resolve, reject) => {
      passportConfig.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
          logger.error(err)
          reject(err.message)
        }
        if (!user) return reject(info.message)
        req.logIn(user, { session: false }, async err => {
          if (err) return reject(err)
          let token = await user.generateAuthToken('auth', false)
          resolve({ user, token })
        })
      })(req)
    })
  }
}
