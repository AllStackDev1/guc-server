/**
 * User Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'UserValidations'
module.exports.dependencies = ['celebrate', 'miscHelpers']
module.exports.factory = (_celebrate, helpers) => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
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
        .required(),
      password: Joi.string()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        .required()
    })
  })

  const patch = celebrate({
    body: Joi.object().keys({
      firstName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      lastName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      dateOfBirth: Joi.date(),
      phoneNumber: Joi.string().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/)
    })
  })

  const login = celebrate({
    body: Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().required()
    })
  })

  const paramsQuery = celebrate({
    params: Joi.object()
      .keys({
        token: Joi.string(),
        email: Joi.string().email({ minDomainSegments: 2 })
      })
      .xor('token', 'email')
  })

  const querySearch = celebrate({
    query: Joi.object().keys({
      roles: Joi.string(),
      email: Joi.string(),
      users: Joi.string()
    })
  })

  const verifyToken = celebrate({
    query: Joi.object().keys({
      token: Joi.string().required()
    })
  })

  return {
    post,
    patch,
    login,
    paramsQuery,
    querySearch,
    verifyToken
  }
}
