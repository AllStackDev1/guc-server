/**
 * Admin Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'AdminValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const create = celebrate({
    body: Joi.object().keys({
      firstName: Joi.string()
        .regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/)
        .required(),
      lastName: Joi.string()
        .regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/)
        .required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        .required()
    })
  })

  const patch = celebrate({
    body: Joi.object().keys({
      firstName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      lastName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    })
  })

  const login = celebrate({
    body: Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }),
      password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    })
  })

  return {
    login,
    create,
    patch
  }
}
