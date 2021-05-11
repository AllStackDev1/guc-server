/**
 * EmergencyContact Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'EmergencyContactValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string().required(),
      name: Joi.string().required(),
      relationship: Joi.string().required(),
      contactNumber: Joi.string().required()
    })
  })

  const put = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string(),
      name: Joi.string(),
      relationship: Joi.string(),
      contactNumber: Joi.string()
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
