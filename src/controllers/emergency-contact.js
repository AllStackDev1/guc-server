/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @summary Controller to handle http request for EmergencyContact model related functions
 * @name EmergencyContactController
 * @extends BaseController
 */
module.exports.name = 'EmergencyContactController'
module.exports.dependencies = [
  'EmergencyContactRepository',
  'ApplicantRepository',
  'MailJet',
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
   * @param {object} applicantRepo The repository which will handle the operations to be
   * performed in this controller
   * @param {object} mailJet - mailing function object
   * @param {object} getEnvs - env object
   * @param {object} helper - helper functions object
   * @param {object} logger - logger functions
   * @param {object} response - response handler function object
   * @param {object} mongoose mongodb middleware
   */
  constructor(repo, applicantRepo, mailJet, getEnvs, helper, logger, response, mongoose) {
    super(repo, mongoose, helper, logger, response)
    this.name = 'Emergency contact'
    this.listening = true
    this.applicantRepo = applicantRepo
    this.mailJet = mailJet
    this.getEnvs = getEnvs

    this.preGet = this.preGet.bind(this)
    this.preInsert = this.preInsert.bind(this)

    // events
    this.on('insert', async (req, doc) => {
      try {
        await this.applicantRepo.update(doc.applicant, { stage: 12 })
        const { eImgLoc } = this.getEnvs(process.env.NODE_ENV)
        const payload = {
          email: doc.email,
          name: doc.firstName + ' ' + doc.lastName,
          data: {
            images: eImgLoc,
            firstName: doc.firstName,
            year: new Date().getFullYear()
          }
        }
        this.mailJet.welcomeEmail(payload)
      } catch (error) {
        this.log(error)
      }
    })
  }

  async preInsert(req, res, next) {
    if (req.user.code) {
      req.body.applicant = req.user._id
    }
    next()
  }

  async preGet(req, res, next) {
    if (req.user.code) {
      req.query.applicant = req.user._id
    }
    next()
  }
}
