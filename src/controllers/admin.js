/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @summary Controller to handle http request for admin model related functions
 * @name AdminController
 * @extends BaseController
 */
module.exports.name = 'AdminController'
module.exports.dependencies = ['AdminRepository', 'miscHelpers', 'logger', 'response', 'mongoose']
module.exports.factory = class extends BaseController {
  /**
   * @param {object} repo The repository which will handle the operations to be
   * performed in this controller
   * @param {object} helper - helper object
   * @param {object} logger - logger object
   * @param {object} response - response handler object
   * @param {object} mongoose mongodb middleware
   */
  constructor(repo, helper, logger, response, mongoose) {
    super(repo, mongoose, helper, logger, response)
    this.name = 'Admin'

    this.login = this.login.bind(this)
  }

  async login(req, res) {
    try {
      const result = await this.repo.auth(req)
      this.response.successWithData(res, result)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }
}
