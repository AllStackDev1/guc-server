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
  'InitialEnquiryRepository',
  'PreviousSchoolRepository',
  'StudentBackgroundRepository',
  'SiblingRepository',
  'HealthAndMedicalRepository',
  'GuardianContactInformationRepository',
  'EmergencyContactRepository',
  'DownloadListRepository',
  'PDF',
  'MailJet',
  'Twilio',
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
   * @param {object} initialEnquiryRepo
   * @param {object} previousSchoolRepo
   * @param {object} studentBackgroundRepo
   * @param {object} siblingRepos
   * @param {object} healthAndMedicalRepo
   * @param {object} guardianContactInformationRepo
   * @param {object} emergencyContactRepo
   * @param {object} downloadListRepo
   * @param {object} pdf
   * @param {object} mailJet - mailing function object
   * @param {object} termii - otp functions object
   * @param {object} getEnvs - env object
   * @param {object} helper - helper functions object
   * @param {object} logger - logger functions
   * @param {object} response - response handler function object
   * @param {object} mongoose mongodb middleware
   */
  constructor(
    repo,
    initialEnquiryRepo,
    previousSchoolRepo,
    studentBackgroundRepo,
    siblingRepos,
    healthAndMedicalRepo,
    guardianContactInformationRepo,
    emergencyContactRepo,
    downloadListRepo,
    pdf,
    mailJet,
    twilio,
    termii,
    getEnvs,
    helper,
    logger,
    response,
    mongoose
  ) {
    super(repo, mongoose, helper, logger, response)
    this.name = 'Applicant'
    this.listening = true
    this.mailJet = mailJet
    this.twilio = twilio
    this.termii = termii
    this.getEnvs = getEnvs
    this.pdf = pdf

    this.initialEnquiryRepo = initialEnquiryRepo
    this.previousSchoolRepo = previousSchoolRepo
    this.studentBackgroundRepo = studentBackgroundRepo
    this.siblingRepos = siblingRepos
    this.healthAndMedicalRepo = healthAndMedicalRepo
    this.guardianContactInformationRepo = guardianContactInformationRepo
    this.emergencyContactRepo = emergencyContactRepo
    this.downloadListRepo = downloadListRepo

    // events
    this.on('insert', (req, doc) => {
      const { clientUrl, eImgLoc } = this.getEnvs
      const payload = {
        emailsToSend: [doc.email],
        name: doc.firstName + ' ' + doc.lastName,
        data: {
          code: doc.code,
          images: eImgLoc,
          firstName: doc.firstName,
          year: new Date().getFullYear(),
          link: clientUrl + '/login?code=' + doc.code
        }
      }
      this.mailJet.applicationCodeEmail(payload)
    })

    this.on('update', async (req, doc) => {
      const { eImgLoc } = this.getEnvs
      const payload = {
        emailsToSend: [doc.email],
        name: doc.firstName + ' ' + doc.lastName,
        files: [doc.resultDoc],
        data: {
          images: eImgLoc,
          firstName: doc.firstName,
          year: new Date().getFullYear()
        }
      }
      if (doc.stage === 14) {
        this.mailJet.resultEmail(payload)
      }
    })

    this.on('delete', async (req, doc) => {
      try {
        const query = { applicant: doc._id }
        await this.initialEnquiryRepo.deleteOne(query)
        await this.previousSchoolRepo.removeMany(query)
        await this.studentBackgroundRepo.deleteOne(query)
        await this.siblingRepos.removeMany(query)
        await this.healthAndMedicalRepo.deleteOne(query)
        await this.guardianContactInformationRepo.deleteOne(query)
        await this.emergencyContactRepo.deleteOne(query)
        await this.downloadListRepo.deleteOne(query)
      } catch (error) {
        this.log(error)
      }
    })

    this.on('save-application-form', async (id, file) => {
      try {
        await this.repo.update(id, { formDoc: file })
      } catch (error) {
        this.log(error)
      }
    })

    // method binding
    this.auth = this.auth.bind(this)
    this.preGet = this.preGet.bind(this)
    this.contactUs = this.contactUs.bind(this)
    this.verifyOTP = this.verifyOTP.bind(this)
    this.preInsert = this.preInsert.bind(this)
    this.resendCode = this.resendCode.bind(this)
    this.getResultFile = this.getResultFile.bind(this)
    this.jobApplication = this.jobApplication.bind(this)
    this.paymentWebHook = this.paymentWebHook.bind(this)
    this.deleteApplicants = this.deleteApplicants.bind(this)
    this.getApplicationForm = this.getApplicationForm.bind(this)
    this.fetchApplicantDetails = this.fetchApplicantDetails.bind(this)
    this.getApplicantWithResult = this.getApplicantWithResult.bind(this)
    this.fetchAllApplicantDetails = this.fetchAllApplicantDetails.bind(this)
  }

  async preGet(req, res, next) {
    try {
      if (!req.query.completed) {
        req.query.stage = { $lte: 11 }
      }
      delete req.query.completed
      next()
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async auth(req, res) {
    try {
      const applicant = await this.repo.getOne({ code: req.body.code })
      if (!applicant) {
        throw new Error(
          `No ${this.name.toLowerCase()} with application code: ${req.body.code} found.`
        )
      }
      // const response = await this.termii.sendOtp(applicant.phoneNumber)
      // if (response.message) {
      //   this.log(response.message)
      //   throw new Error('Unexpected error, please try again or contact support.')
      // }
      // this.response.successWithData(
      //   res,
      //   response,
      //   'OTP Code has been sent to your registered phone number'
      // )
      const token = await applicant.generateAuthToken()
      this.response.successWithData(res, token)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async verifyOTP(req, res) {
    try {
      const response = await this.termii.verifyOtp(req.body)
      if (response.status !== 200 || !response.msisdn) {
        throw new Error('OTP invalid or expired!')
      }
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
      const { clientUrl, eImgLoc } = this.getEnvs
      const payload = {
        emailsToSend: [applicant.email],
        name: applicant.firstName + ' ' + applicant.lastName,
        data: {
          code: applicant.code,
          images: eImgLoc,
          firstName: applicant.firstName,
          year: new Date().getFullYear(),
          link: clientUrl + '/application-process?code=' + applicant.code
        }
      }
      await this.mailJet.applicationCodeEmail(payload)
      this.response.success(res, `Application code sent to ${applicant.email}`)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async getResultFile(req, res, next) {
    try {
      const applicant = await this.repo.getById(req.user._id)
      if (!applicant) throw new Error(`No ${this.name.toLowerCase()} found with this id`)
      this.response.successWithData(res, applicant.resultDoc)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async getApplicantWithResult(req, res, next) {
    try {
      const applicants = await this.repo.get({ stage: 14, resultDoc: { $ne: null } })
      this.response.successWithData(res, applicants)
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
  async deleteApplicants(req, res) {
    try {
      await req.body.forEach(async element => {
        const doc = await this.repo.delete(element)
        if (doc) {
          this.listening && this.emit('delete', req, doc)
        }
      })
      this.response.success(res, `${this.name}(s) deleted successfully!`)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async fetchApplicantDetails(req, res, call) {
    try {
      const applicant = {}
      const query = { applicant: req.params.id }
      applicant.initialEnquiry = await this.initialEnquiryRepo.getOne(query)
      if (applicant.initialEnquiry) {
        applicant.previousSchools = await this.previousSchoolRepo.get(query)
        applicant.studentBackground = await this.studentBackgroundRepo.getOne(query)
        applicant.siblings = await this.siblingRepos.get(query)
        applicant.healthAndMedical = await this.healthAndMedicalRepo.getOne(query)
        applicant.guardianContactInformation = await this.guardianContactInformationRepo.getOne(
          query
        )
        applicant.emergencyContact = await this.emergencyContactRepo.getOne(query)
        if (call) {
          return applicant
        } else {
          this.response.successWithData(res, applicant)
        }
      } else {
        if (call) {
          return {}
        } else {
          this.response.successWithData(res, {}, 'No record found')
        }
      }
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async fetchAllApplicantDetails(req, res) {
    try {
      const applicantsPromises = await req.body.applicants.map(async applicant => {
        const query = { applicant: applicant._id }
        applicant.initialEnquiry = await this.initialEnquiryRepo.getOne(query)
        if (req.body.export) {
          if (!applicant.initialEnquiry) {
            applicant.initialEnquiry = { studentInfo: {} }
          }
          return {
            _id: applicant._id,
            code: applicant.code,
            ...applicant.initialEnquiry.studentInfo
          }
        } else {
          if (applicant.initialEnquiry) {
            applicant.previousSchools = await this.previousSchoolRepo.get(query)
            applicant.studentBackground = await this.studentBackgroundRepo.getOne(query)
            applicant.siblings = await this.siblingRepos.get(query)
            applicant.healthAndMedical = await this.healthAndMedicalRepo.getOne(query)
            applicant.guardianContactInformation = await this.guardianContactInformationRepo.getOne(
              query
            )
            applicant.emergencyContact = await this.emergencyContactRepo.getOne(query)
            return applicant
          } else {
            return {}
          }
        }
      })
      // wait until all promises resolve
      const applicants = await Promise.all(applicantsPromises)

      this.response.successWithData(res, applicants)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async jobApplication(req, res) {
    try {
      const payload = {
        emailsToSend: ['principal@gcu.sch.ng', 'admin@gcu.sch.ng', 'gcu.umuahia@gmail.com'],
        files: req.body.files,
        subject: `Application for this role: ${req.body.jobTitle}`,
        content: `<p><b>Name:</b> ${req.body.fullname}</p> ${
          req.body.message ? `<p><b>Personl Message:</b> ${req.body.message}</p>` : ''
        } <br/> <b>Please find attacted applicant resume and cover letter.</b>`
      }
      await this.mailJet.sendMail(payload)
      this.response.success(res, 'Message sent successfully')
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async contactUs(req, res) {
    try {
      const payload = {
        emailsToSend: ['admin@gcu.sch.ng', 'gcu.umuahia@gmail.com'],
        name: req.body.name,
        subject: req.body.subject,
        content: `<b>Sender Name:</b>  ${req.body.name} <br />
        <b>Sender Email:</b>: ${req.body.email} <br />
        <b>Sender Message:</b> ${req.body.message}
        `
      }
      await this.mailJet.sendMail(payload)
      this.response.success(res, 'Message sent successfully')
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  async paymentWebHook(req, res) {
    try {
      const hash = this.helper.getHash(req.body)
      if (hash === req.headers['x-paystack-signature']) {
        if (req.body.event === 'charge.success' && req.body.data.status === 'success') {
          const reference = Buffer.from(req.body.data.reference, 'base64').toString()
          const applicant = await this.repo.getOne({
            code: reference.split('_')[0],
            status: this.helper.Status.PENDING
          })
          if (applicant) {
            applicant.status = this.helper.Status.PAID
            applicant.stage = 6
            await applicant.save()
          }
        }
      }
      this.response.success(res)
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }

  /**
   * @description
   * This method generate application form,
   * if successful, response with base64
   */
  async getApplicationForm(req, res) {
    try {
      // Helpers
      const { formatDate } = this.helper
      const applicant = await this.repo.getById(req.params.id)
      if (applicant.formDoc) {
        this.response.successWithData(res, applicant.formDoc)
      } else {
        // form can only be printed for completed application form
        if (applicant.stage < 12) {
          throw new Error('Cannot generated application form for uncompleted application!')
        }

        // perform some data modification
        const data = {
          code: applicant.code,
          type: 'application-form',
          now: formatDate(null, 'llll')
        }

        // Generate pdf file
        const file = await this.pdf(req, data)

        // emit an event to save-application-form
        this.emit('save-application-form', applicant._id, file)
        this.response.successWithData(res, file)
      }
    } catch (error) {
      this.response.error(res, error.message || error)
    }
  }
}
