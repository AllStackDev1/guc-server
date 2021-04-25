/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @summary Controller to handle http request for student model related functions
 * @name StudentController
 * @extends BaseController
 */
module.exports.name = 'StudentController'
module.exports.dependencies = ['StudentRepository', 'miscHelpers', 'logger', 'response', 'mongoose']
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
    this.name = 'Student'
    this.listening = true
    this.logger = logger

    // events
    this.on('insert', async user => {
      try {
        // await this.mailer.signUp(user.email, user.role, token)
      } catch (error) {
        this.logger.error(error)
      }
    })

    // method binding
    this.auth = this.auth.bind(this)
    this.otpVerification = this.otpVerification.bind(this)
  }

  async auth(req, res) {
    try {
      const student = await this.repo.getOne({ code: req.body.code })
      // TODO: call termii to send an automated otp to student.phoneNumber
      // on success we sent a reply
      this.response.success(res, `Please wait for OTP sent to ${student.phoneNumber}`)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async otpVerification(req, res) {
    try {
      // TODO: call termii to verify otp
      // on success fetch student data
      const student = await this.repo.getOne({ code: req.body.otp })
      this.response.successWithData(res, student)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }
}
