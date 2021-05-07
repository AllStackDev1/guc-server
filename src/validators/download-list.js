/**
 * DownloadList Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'DownloadListValidations'
module.exports.dependencies = ['celebrate']
module.exports.factory = _celebrate => {
  'use strict'

  const { celebrate, Joi } = _celebrate

  const post = celebrate({
    body: Joi.array().items({
      applicant: Joi.string().required()
    })
  })

  const put = celebrate({
    body: Joi.object().keys({
      applicants: Joi.array().items({
        applicant: Joi.string().required()
      })
    })
  })

  const querySearch = celebrate({
    query: Joi.object().keys({
      applicant: Joi.string()
    })
  })

  const deleteDownloadLists = celebrate({
    body: Joi.array().items({
      _id: Joi.string().required()
    })
  })

  return {
    put,
    post,
    querySearch,
    deleteDownloadLists
  }
}
