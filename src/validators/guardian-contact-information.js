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
      forename: Joi.string().required(),
      surname: Joi.string().required(),
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
      applicant: Joi.string().required(),
      relation: Joi.string().required(),
      title: Joi.string().required(),
      forename: Joi.string().required(),
      surname: Joi.string().required(),
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
