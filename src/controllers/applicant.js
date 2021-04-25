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
    this.on('insert', async (req, doc) => {
      try {
        const { clientUrl } = this.getEnvs(process.env.NODE_ENV)
        const payload = {
          subject: 'Your GCU Application code',
          email: doc.email,
          name: doc.firstName,
          data: {
            code: doc.code,
            firstName: doc.firstName,
            link: clientUrl + '/login'
          }
        }
        await this.mailJet.enrollEmail(payload)
      } catch (error) {
        this.log(error)
      }
    })

    // method binding
    this.auth = this.auth.bind(this)
    this.verifyOTP = this.verifyOTP.bind(this)
    this.getAA = this.getAA.bind(this)
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
        `Please wait for OTP sent to ${applicant.phoneNumber}`
      )
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async verifyOTP(req, res) {
    try {
      const response = await this.termii.verifyOtp(req.body)
      if (response.verified !== 'True') throw new Error('OTP expired!')
      const applicant = await this.repo.getOne({ phoneNumber: '+' + response.msisdn })
      const token = await applicant.generateToken()
      this.response.successWithData(res, token)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async getAA(req, res) {
    try {
      this.response.success(res, 'just test')
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }
}
