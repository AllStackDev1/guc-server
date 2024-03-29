/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @summary Controller to handle http request for InitialEnquiry model related functions
 * @name InitialEnquiryController
 * @extends BaseController
 */
module.exports.name = 'InitialEnquiryController'
module.exports.dependencies = [
  'InitialEnquiryRepository',
  'ApplicantRepository',
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
   * @param {object} helper - helper functions object
   * @param {object} logger - logger functions
   * @param {object} response - response handler function object
   * @param {object} mongoose mongodb middleware
   */
  constructor(repo, applicantRepo, helper, logger, response, mongoose) {
    super(repo, mongoose, helper, logger, response)
    this.name = 'Initial Enquiry'
    this.listening = true
    this.applicantRepo = applicantRepo

    this.preGet = this.preGet.bind(this)
    this.preInsert = this.preInsert.bind(this)

    // events
    this.on('insert', async (req, doc) => {
      try {
        await this.applicantRepo.update(doc.applicant, { stage: 6.2 })
      } catch (error) {
        this.log(error)
      }
    })
  }

  async preInsert(req, res, next) {
    const { PAID } = this.helper.Status
    if (req.user.code && req.user.status === PAID) {
      req.body.applicant = req.user._id
      next()
    } else {
      this.response.error(res, 'Payment is required to process with this stage.')
    }
  }

  async preGet(req, res, next) {
    if (req.user.code) {
      req.query.applicant = req.user._id
    }
    next()
  }
}
