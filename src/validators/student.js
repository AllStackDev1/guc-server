/**
 * Student Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'StudentValidations'
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
        .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/)
        .required()
    })
  })

  const patch = celebrate({
    body: Joi.object().keys({
      firstName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      lastName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      email: Joi.string().email({ minDomainSegments: 2 }),
      phoneNumber: Joi.string()
    })
  })

  const otpVerification = celebrate({
    body: Joi.object().keys({
      otp: Joi.string().required()
    })
  })

  const auth = celebrate({
    body: Joi.object().keys({
      code: Joi.string().required()
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
    querySearch,
    otpVerification
  }
}
