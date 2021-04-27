/**
 * Applicant Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'ApplicantValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const enroll = celebrate({
    body: Joi.object().keys({
      firstName: Joi.string()
        .regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/)
        .required(),
      lastName: Joi.string()
        .regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/)
        .required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      phoneNumber: Joi.string()
        .regex(/(^[0]\d{10}$)|(^[+]?[234]\d{12}$)/)
        .required()
    })
  })

  const patch = celebrate({
    body: Joi.object().keys({
      firstName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      lastName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      email: Joi.string().email({ minDomainSegments: 2 })
    })
  })

  const auth = celebrate({
    body: Joi.object().keys({
      code: Joi.string().required()
    })
  })

  const verifyOTP = celebrate({
    body: Joi.object().keys({
      pin_id: Joi.string().required(),
      pin: Joi.string().required()
    })
  })

  const resendCode = celebrate({
    body: Joi.object().keys({
      phoneNumber: Joi.string().required()
    })
  })

  const querySearch = celebrate({
    query: Joi.object().keys({
      email: Joi.string()
    })
  })

  return {
    auth,
    patch,
    enroll,
    verifyOTP,
    resendCode,
    querySearch
  }
}
