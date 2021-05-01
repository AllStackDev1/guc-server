/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @summary Controller to handle http request for PreviousSchool model related functions
 * @name PreviousSchoolController
 * @extends BaseController
 */
module.exports.name = 'PreviousSchoolController'
module.exports.dependencies = [
  'PreviousSchoolRepository',
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
    this.name = 'Previous school'
    this.listening = true
    this.applicantRepo = applicantRepo

    this.preGet = this.preGet.bind(this)
    this.preInsert = this.preInsert.bind(this)

    // events
    this.on('insert', async (req, doc) => {
      try {
        await this.applicantRepo.update(doc.applicant, { stage: 7 })
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
