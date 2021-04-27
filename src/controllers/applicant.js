/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @summary Controller to handle http request for applicant model related functions
 * @name ApplicantController
 * @extends BaseController
 */
module.exports.name = 'ApplicantController'
module.exports.dependencies = [
  'ApplicantRepository',
  'MailJet',
  'Termii',
  'envs',
  'miscHelpers',
  'logger',
  'response',
  'mongoose'
]
module.exports.factory = class extends BaseController {
  /**
   * @param {object} repo The repository which will handle the operations to be
   * performed in this controller
   * @param {object} mailJet - mailing function object
   * @param {object} termii - otp functions object
   * @param {object} getEnvs - env object
   * @param {object} helper - helper functions object
   * @param {object} logger - logger functions
   * @param {object} response - response handler function object
   * @param {object} mongoose mongodb middleware
   */
  constructor(repo, mailJet, termii, getEnvs, helper, logger, response, mongoose) {
    super(repo, mongoose, helper, logger, response)
    this.name = 'Applicant'
    this.listening = true
    this.mailJet = mailJet
    this.termii = termii
    this.getEnvs = getEnvs

    // events
    this.on('insert', (req, doc) => {
      const { clientUrl, eImgLoc } = this.getEnvs(process.env.NODE_ENV)
      const payload = {
        email: doc.email,
        name: doc.firstName + ' ' + doc.lastName,
        data: {
          code: doc.code,
          images: eImgLoc,
          firstName: doc.firstName,
          year: new Date().getFullYear(),
          link: clientUrl + '/login?code=' + doc.code
        }
      }
      this.mailJet.welcomeEmail(payload)
      this.mailJet.applicationCodeEmail(payload)
    })

    // method binding
    this.auth = this.auth.bind(this)
    this.verifyOTP = this.verifyOTP.bind(this)
    this.preInsert = this.preInsert.bind(this)
    this.resendCode = this.resendCode.bind(this)
  }

  async auth(req, res) {
    try {
      const applicant = await this.repo.getOne({ code: req.body.code })
      if (!applicant) {
        throw new Error(
          `No ${this.name.toLowerCase()} with application code: ${req.body.code} found.`
        )
      }
      const response = await this.termii.sendOtp(applicant.phoneNumber)
      if (response.message) {
        this.log(response.message)
        throw new Error('Unexpected error, please try again')
      }

      this.response.successWithData(
        res,
        response,
        'OTP Code has been sent to your registered phone number'
      )
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async verifyOTP(req, res) {
    try {
      const response = await this.termii.verifyOtp(req.body)
      if (response.verified !== 'true' && !response.msisdn) throw new Error('OTP expired!')
      const applicant = await this.repo.getOne({ phoneNumber: response.msisdn })
      const token = await applicant.generateAuthToken()
      this.response.successWithData(res, token)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async preInsert(req, res, next) {
    try {
      const applicant = await this.repo.getOne({ phoneNumber: req.body.phoneNumber })
      if (applicant) {
        throw new Error(`An ${this.name.toLowerCase()} with this phone number already exist`)
      }
      next()
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async resendCode(req, res, next) {
    try {
      const applicant = await this.repo.getOne({ phoneNumber: req.body.phoneNumber })
      if (!applicant) {
        throw new Error(
          `No ${this.name.toLowerCase()} found with this phone number: ${req.body.phoneNumber}`
        )
      }
      const { clientUrl, eImgLoc } = this.getEnvs(process.env.NODE_ENV)
      const payload = {
        email: applicant.email,
        name: applicant.firstName + ' ' + applicant.lastName,
        data: {
          code: applicant.code,
          images: eImgLoc,
          firstName: applicant.firstName,
          year: new Date().getFullYear(),
          link: clientUrl + '/login?code=' + applicant.code
        }
      }
      await this.mailJet.applicationCodeEmail(payload)
      this.response.success(res, `Application code sent to ${applicant.email}`)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }
}
