/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @summary Controller to handle http request for user model related functions
 * @name UserController
 * @extends BaseController
 */
module.exports.name = 'UserController'
module.exports.dependencies = [
  'UserRepository',
  'Mailer',
  'Validator',
  'miscHelpers',
  'logger',
  'response',
  'mongoose'
]
module.exports.factory = class extends BaseController {
  /**
   * @param {object} repo The repository which will handle the operations to be
   * performed in this controller
   * @param {object} Mailer - validator object
   * @param {object} validator - validator object
   * @param {object} helper - helper object
   * @param {object} logger - logger object
   * @param {object} response - response handler object
   * @param {object} mongoose mongodb middleware
   */
  constructor(repo, mailer, validator, helper, logger, response, mongoose) {
    super(repo, mongoose, helper, logger, response)
    this.name = 'User'
    this.listening = true
    this.mailer = mailer
    this.validator = validator

    this.login = this.login.bind(this)
    this.verifyAccount = this.verifyAccount.bind(this)

    this.on('insert', async user => {
      try {
        const token = await user.generateAuthToken('validation', '6h')
        await this.mailer.signUp(user.email, user.role, token)
      } catch (error) {
        logger.error(error)
      }
    })
  }

  async login(req, res) {
    try {
      const result = await this.repo.auth(req)
      this.response.successWithData(res, result)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async verifyAccount(req, res) {
    try {
      const userId = await this.Validator.verifyToken(req.body)
      await this.repo.destroyToken(userId, req.body.token)
      const user = await this.repo.getById(userId)
      if (user.isVerified) {
        throw new Error(this.name + ' already verified!')
      }
      user.isVerified = true
      await user.save()
      this.response.successWithData(res, user.email)
    } catch (error) {
      if (error._id) await this.service.destroyToken(error._id, req.body.token)
      this.response.error(res, error.message || error)
    }
  }
}
