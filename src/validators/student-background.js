/**
 * StudentBackground Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'StudentBackgroundValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string().required(),
      specialNeeds: Joi.string().required(),
      details: Joi.string()
        .when('specialNeeds', {
          is: 'yes',
          then: Joi.string().required()
        })
        .allow('')
    })
  })

  const put = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string(),
      specialNeeds: Joi.string(),
      details: Joi.string().allow('')
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
