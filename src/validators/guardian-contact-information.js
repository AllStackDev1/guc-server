/**
 * GuardianContactInformation Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'GuardianContactInformationValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string().required(),
      relation: Joi.string().required(),
      title: Joi.string().required(),
      firstName: Joi.string().required(),
      familyName: Joi.string().required(),
      email: Joi.string().required(),
      occupation: Joi.string().required(),
      addressOne: Joi.string().required(),
      addressTwo: Joi.string().allow(''),
      state: Joi.string().required(),
      mobileNumber: Joi.string().required(),
      homeNumber: Joi.string().allow(''),
      workNumber: Joi.string().allow(''),
      homeLanguage: Joi.string().required(),
      studentAddress: Joi.string().required(),
      hearAboutUs: Joi.string().required(),
      permissions: Joi.string().required()
    })
  })

  const put = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string(),
      relation: Joi.string(),
      title: Joi.string(),
      firstName: Joi.string(),
      familyName: Joi.string(),
      email: Joi.string(),
      occupation: Joi.string(),
      addressOne: Joi.string(),
      addressTwo: Joi.string().allow(''),
      state: Joi.string(),
      mobileNumber: Joi.string(),
      homeNumber: Joi.string().allow(''),
      workNumber: Joi.string().allow(''),
      homeLanguage: Joi.string(),
      studentAddress: Joi.string(),
      hearAboutUs: Joi.string(),
      permissions: Joi.string()
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
