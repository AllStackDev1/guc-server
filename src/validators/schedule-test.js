/**
 * DownloadList Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'ScheduleTestValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
    body: Joi.array().items({
      code: Joi.string().required(),
      accessCode: Joi.string().required(),
      examDate: Joi.date().required(),
      status: Joi.bool()
    })
  })

  const put = celebrate({
    body: Joi.object().keys({
      code: Joi.string(),
      accessCode: Joi.string(),
      resultDoc: Joi.string(),
      examDate: Joi.date(),
      status: Joi.bool()
    })
  })

  const querySearch = celebrate({
    query: Joi.object().keys({
      code: Joi.string(),
      accessCode: Joi.string(),
      status: Joi.bool()
    })
  })

  const deleteScheduleTests = celebrate({
    body: Joi.array().items({
      _id: Joi.string().required()
    })
  })

  return {
    put,
    post,
    querySearch,
    deleteScheduleTests
  }
}
