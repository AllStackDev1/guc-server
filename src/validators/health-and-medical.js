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
      diabetes: Joi.bool().required(),
      epilepsy: Joi.bool().required(),
      others: Joi.bool().required(),
      immuneFile: Joi.string().allow(''),
      requireMedicalPlan: Joi.string().allow(''),
      takeRegularMedication: Joi.string().allow(''),
      dietaryRestriction: Joi.string().allow(''),
      physicalRestriction: Joi.string().allow(''),
      otherMedicalIssues: Joi.string().allow(''),
      isImmunised: Joi.string().required()
    })
  })

  const put = celebrate({
    body: Joi.object().keys({
      applicant: Joi.string(),
      asthma: Joi.bool(),
      allergies: Joi.bool(),
      diabetes: Joi.bool(),
      epilepsy: Joi.bool(),
      others: Joi.bool(),
      immuneFile: Joi.string().allow(''),
      requireMedicalPlan: Joi.string().allow(''),
      takeRegularMedication: Joi.string().allow(''),
      dietaryRestriction: Joi.string().allow(''),
      physicalRestriction: Joi.string().allow(''),
      otherMedicalIssues: Joi.string().allow(''),
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
