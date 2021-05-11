/**
 * HealthAndMedical Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'HealthAndMedicalValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string().required(),
      asthma: Joi.bool().required(),
      allergies: Joi.bool().required(),
      diabiates: Joi.bool().required(),
      epilepsy: Joi.bool().required(),
      immuneFile: Joi.string().allow(''),
      requireMedicalPlan: Joi.string().required(),
      takeRegularMedication: Joi.string().required(),
      dietaryRestriction: Joi.string().required(),
      physicalRestriction: Joi.string().required(),
      otherMedicalIssues: Joi.string().required(),
      isImmunised: Joi.string().required()
    })
  })

  const put = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string(),
      asthma: Joi.bool(),
      allergies: Joi.bool(),
      diabiates: Joi.bool(),
      epilepsy: Joi.bool(),
      immuneFile: Joi.string().allow(''),
      requireMedicalPlan: Joi.string(),
      takeRegularMedication: Joi.string(),
      dietaryRestriction: Joi.string(),
      physicalRestriction: Joi.string(),
      otherMedicalIssues: Joi.string(),
      isImmunised: Joi.string()
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
