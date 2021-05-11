/**
 * Sibling Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'SiblingValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
    body: Joi.object().keys({
      dob: Joi.string().required(),
      name: Joi.string().required(),
      gender: Joi.string().required(),
      applicant: Joi.string().required()
    })
  })

  const put = celebrate({
    body: Joi.object().keys({
      dob: Joi.string(),
      name: Joi.string(),
      gender: Joi.string(),
      applicant: Joi.string()
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
