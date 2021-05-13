/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @summary Controller to handle http request for ScheduleTest model related functions
 * @name ScheduleTestController
 * @extends BaseController
 */
module.exports.name = 'ScheduleTestController'
module.exports.dependencies = [
  'ScheduleTestRepository',
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
   * @param {object} applicantRepo - applicant repository
   * @param {object} mailJet - mailing function object
   * @param {object} getEnvs - env object
   * @param {object} helper - helper functions object
   * @param {object} logger - logger functions
   * @param {object} response - response handler function object
   * @param {object} mongoose mongodb middleware
   */
  constructor(repo, applicantRepo, mailJet, getEnvs, helper, logger, response, mongoose) {
    super(repo, mongoose, helper, logger, response)
    this.name = 'Schedule Test'
    this.listening = true
    this.mailJet = mailJet
    this.getEnvs = getEnvs
    this.applicantRepo = applicantRepo

    this.fetch = this.fetch.bind(this)
    this.drop = this.drop.bind(this)
    this.deleteScheduleTests = this.deleteScheduleTests.bind(this)

    this.on('insert', async (req, docs) => {
      await docs.forEach(async doc => {
        const applicant = await this.applicantRepo.getOne({ code: doc.code })
        const { eImgLoc } = this.getEnvs
        const payload = {
          email: applicant.email,
          name: applicant.firstName + ' ' + applicant.lastName,
          data: {
            images: eImgLoc,
            accessCode: doc.accessCode,
            examDate: this.helper.getformattedDate(doc.examDate),
            examTime: new Date(doc.examDate).toLocaleTimeString('en-US'),
            firstName: applicant.firstName,
            year: new Date().getFullYear()
          }
        }
        applicant.stage = 13
        await applicant.save()
        this.mailJet.scheduleTest(payload)
      })
    })
  }

  /**
   * @description
   * This method queries the db to fetch orders wrt the query passed
   * Response with an array of orders obj or error message
   */
  async fetch(req, res) {
    try {
      const ScheduleTests = await this.repo.aggregate([
        { $match: req.query },
        {
          $lookup: {
            from: 'applicants',
            let: { code: '$code' },
            pipeline: [{ $match: { $expr: { $eq: ['$code', '$$code'] } } }],
            as: 'applicant'
          }
        },
        { $unwind: '$applicant' },
        {
          $project: {
            _id: '$_id',
            code: '$code',
            status: '$status',
            examDate: '$examDate',
            createdAt: '$createdAt',
            accessCode: '$accessCode',
            email: '$applicant.email',
            applicant: '$applicant._id',
            phoneNumber: '$applicant.phoneNumber',
            fullName: { $concat: ['$applicant.firstName', ' ', '$applicant.lastName'] }
          }
        }
      ])
      this.response.successWithData(res, ScheduleTests)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @summary Handle http request to delete a record
   * @param { { params: { id: string } } } req The express request object
   * @param { object }                      res The express response object
   * @emits event:delete
   * @returns {Promise<Function>}
   */
  async deleteScheduleTests(req, res) {
    try {
      await req.body.forEach(async element => {
        await this.repo.delete(element)
      })
      this.response.success(res, `${this.name}(s) deleted successfully!`)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @summary Handle http request to delete a record
   * @param { { params: { id: string } } } req The express request object
   * @param { object }                      res The express response object
   * @emits event:delete
   * @returns {Promise<Function>}
   */
  async drop(req, res) {
    try {
      await this.repo.removeMany({})
      this.response.success(res, `${this.name}(s) cleared successfully!`)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }
}
