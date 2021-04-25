/* eslint-disable no-useless-constructor */
/* eslint-disable space-before-function-paren */
'use strict'
const BaseRepository = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @description This class extends the BaseRepository class.
 * This is a dependency for the AdminController class.
 */
module.exports.name = 'AdminRepository'
module.exports.dependencies = ['AdminModel', 'passport-config', 'logger']
module.exports.factory = class extends BaseRepository {
  /**
   * @param { object } model mongodb model which provides the db drive methods.
   * @param {{ debug: Function }} logger - Logger object
   */
  constructor(model, passportConfig, logger) {
    super(model, logger)
    this.logger = logger
    this.passportConfig = passportConfig
    this.auth = this.auth.bind(this)
  }

  /**
   * Authenticate a admin.
   * @param {[]} req request for passport authentication.
   * @return Returns the authenticated admin's document.
   */
  auth(req) {
    return new Promise((resolve, reject) => {
      this.passportConfig.authenticate('local', { session: false }, (err, admin, info) => {
        if (err) {
          this.logger.error(err)
          reject(err.message)
        }
        if (!admin) return reject(info.message)
        req.logIn(admin, { session: false }, async err => {
          if (err) return reject(err)
          const token = await admin.generateAuthToken()
          resolve(token)
        })
      })(req)
    })
  }
}
