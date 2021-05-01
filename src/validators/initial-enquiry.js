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
          surname: Joi.string().required(),
          middleName: Joi.string().required(),
          preferedName: Joi.string().required(),
          dob: Joi.string().required(),
          gender: Joi.string().required(),
          countryOfBirth: Joi.string().required(),
          nationality: Joi.string().required(),
          dualNationality: Joi.string().allow(''),
          firstLanguage: Joi.string().required(),
          homeLanguage: Joi.string().required(),
          religion: Joi.string().required()
        })
        .required()
    })
  })

  const put = celebrate({
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
          surname: Joi.string().required(),
          middleName: Joi.string().required(),
          preferedName: Joi.string().required(),
          dob: Joi.string().required(),
          gender: Joi.string().required(),
          countryOfBirth: Joi.string().required(),
          nationality: Joi.string().required(),
          dualNationality: Joi.string().allow(''),
          firstLanguage: Joi.string().required(),
          homeLanguage: Joi.string().required(),
          religion: Joi.string().required()
        })
        .required()
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
