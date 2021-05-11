/**
 * InitialEnquiry Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'InitialEnquiryValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string().required(),
      documents: Joi.object()
        .keys({
          birthCertOrPassport: Joi.string().required(),
          schoolReport: Joi.string().required(),
          passportPhoto: Joi.string().required()
        })
        .required(),
      studentInfo: Joi.object()
        .keys({
          firstName: Joi.string().required(),
          familyName: Joi.string().required(),
          middleName: Joi.string().required(),
          preferedName: Joi.string().required(),
          dob: Joi.string().required(),
          gender: Joi.string().required(),
          countryOfBirth: Joi.string().required(),
          nationality: Joi.string().required(),
          dualNationality: Joi.string().allow(''),
          firstLanguage: Joi.string().required(),
          homeLanguage: Joi.string().required(),
          religion: Joi.string().allow('')
        })
        .required()
    })
  })

  const put = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string(),
      documents: Joi.object().keys({
        birthCertOrPassport: Joi.string(),
        schoolReport: Joi.string(),
        passportPhoto: Joi.string()
      }),
      studentInfo: Joi.object().keys({
        firstName: Joi.string(),
        familyName: Joi.string(),
        middleName: Joi.string(),
        preferedName: Joi.string(),
        dob: Joi.string(),
        gender: Joi.string(),
        countryOfBirth: Joi.string(),
        nationality: Joi.string(),
        dualNationality: Joi.string(),
        firstLanguage: Joi.string(),
        homeLanguage: Joi.string(),
        religion: Joi.string()
      })
    })
  })

  const querySearch = celebrate({
    query: Joi.object().keys({
      applicant: Joi.string()
    })
  })

  return {
    put,
    post,
    querySearch
  }
}
