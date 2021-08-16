/* eslint-disable space-before-function-paren */
'use strict'

/**
 * @author Chinedu Ekene Okpala <chinedu.okpala@completefarmer.com>
 * @summary Controller to handle http request for browser display
 * @name ViewsController
 */
module.exports.name = 'ViewsController'
module.exports.dependencies = ['ApplicantController', 'miscHelpers']
module.exports.factory = (ApplicantController, helpers) => {
  const applicationForm = async (req, res) => {
    const { leanDate } = helpers
    const applicant = await ApplicantController.fetchApplicantDetails(req, res, true)
    const data = {
      ...req.query,
      previousSchools: leanDate(applicant.previousSchools),
      studentBackground: leanDate(applicant.studentBackground),
      studentInfo: leanDate(applicant.initialEnquiry.studentInfo),
      siblings: leanDate(applicant.siblings),
      healthAndMedical: leanDate(applicant.healthAndMedical),
      guardianContactInformation: leanDate(applicant.guardianContactInformation),
      emergencyContact: leanDate(applicant.emergencyContact)
    }
    return await res.render('pdf/application-form', {
      title: 'Application Form',
      data
    })
  }

  return { applicationForm }
}
