/**
 * PreviousSchool Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'PreviousSchoolValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string(),
      name: Joi.string().required(),
      address: Joi.string().required(),
      email: Joi.string().required(),
      dateOfArrival: Joi.string().required(),
      dateOfLeaving: Joi.string().required()
    })
  })

  const put = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string(),
      name: Joi.string().required(),
      address: Joi.string().required(),
      email: Joi.string().required(),
      dateOfArrival: Joi.string().required(),
      dateOfLeaving: Joi.string().required()
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
