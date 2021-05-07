/* eslint-disable space-before-function-paren */
'use strict'
const BaseController = require('./base')

/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @summary Controller to handle http request for DownloadList model related functions
 * @name DownloadListController
 * @extends BaseController
 */
module.exports.name = 'DownloadListController'
module.exports.dependencies = [
  'DownloadListRepository',
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
   * @param {object} mailJet - mailing function object
   * @param {object} getEnvs - env object
   * @param {object} helper - helper functions object
   * @param {object} logger - logger functions
   * @param {object} response - response handler function object
   * @param {object} mongoose mongodb middleware
   */
  constructor(repo, mailJet, getEnvs, helper, logger, response, mongoose) {
    super(repo, mongoose, helper, logger, response)
    this.name = 'Download list'

    this.fetch = this.fetch.bind(this)
    this.drop = this.drop.bind(this)
    this.deleteDownloadLists = this.deleteDownloadLists.bind(this)
  }

  /**
   * @description
   * This method queries the db to fetch orders wrt the query passed
   * Response with an array of orders obj or error message
   */
  async fetch(req, res) {
    try {
      const downloadList = await this.repo.aggregate([
        { $match: req.query },
        {
          $lookup: {
            from: 'applicants',
            let: { applicant: '$applicant' },
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$applicant'] } } }],
            as: 'applicant'
          }
        },
        { $unwind: '$applicant' },
        {
          $project: {
            _id: '$_id',
            applicant: '$applicant._id',
            code: '$applicant.code',
            email: '$applicant.email',
            firstName: '$applicant.firstName',
            lastName: '$applicant.lastName',
            phoneNumber: '$applicant.phoneNumber',
            status: '$applicant.status',
            stage: '$applicant.stage',
            createdAt: '$applicant.createdAt'
          }
        }
      ])
      this.response.successWithData(res, downloadList)
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
  async deleteDownloadLists(req, res) {
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
