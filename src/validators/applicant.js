/**
 * Applicant Validations. Defining user validations schema using celebrate
 * @author Chinedu Ekene Okpala
 */
module.exports.name = 'ApplicantValidations'
module.exports.dependencies = ['celebrate', 'miscHelpers']
module.exports.factory = (_celebrate, helpers) => {
  'use strict'

  const { celebrate, Joi } = _celebrate
  const { PENDING, PAID } = helpers.Status

  const enroll = celebrate({
    body: Joi.object().keys({
      firstName: Joi.string()
        .regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/)
        .required(),
      lastName: Joi.string()
        .regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/)
        .required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      phoneNumber: Joi.string().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/)
    })
  })

  const patch = celebrate({
    body: Joi.object().keys({
      firstName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      lastName: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s-_.]*$/),
      email: Joi.string().email({ minDomainSegments: 2 }),
      status: Joi.string().valid(PENDING, PAID),
      resultDoc: Joi.string(),
      isAdmitted: Joi.bool(),
      stage: Joi.number().valid(5, 6, 6.1, 6.2, 7, 8.1, 8.2, 9, 10, 11, 12, 13, 14, 15)
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

  const resendOTP = celebrate({
    body: Joi.object().keys({
      phoneNumber: Joi.string().required()
    })
  })

  const querySearch = celebrate({
    query: Joi.object().keys({
      completed: Joi.bool().valid(true, false),
      stage: Joi.number().valid(5, 6, 6.1, 6.2, 7, 8.1, 8.2, 9, 10, 11, 12, 13, 14, 15)
    })
  })

  const querySearch2 = celebrate({
    body: Joi.object()
      .keys({
        applicants: Joi.array()
          .items({
            _id: Joi.string().required(),
            code: Joi.string().required()
          })
          .required(),
        export: Joi.bool().valid(true, false).required()
      })
      .required()
  })

  const deleteApplicants = celebrate({
    body: Joi.array().items({
      _id: Joi.string().required()
    })
  })

  const jobApplication = celebrate({
    body: Joi.object().keys({
      fullname: Joi.string().required(),
      files: Joi.array().items(Joi.string().required()).required(),
      message: Joi.string().required(),
      jobTitle: Joi.string().required()
    })
  })

  const contactUs = celebrate({
    body: Joi.array().items({
      fullname: Joi.string().required(),
      files: Joi.array().required(),
      message: Joi.string().required(),
      jobTitle: Joi.string().required()
    })
  })

  return {
    auth,
    patch,
    enroll,
    contactUs,
    verifyOTP,
    resendOTP,
    resendCode,
    querySearch,
    querySearch2,
    jobApplication,
    deleteApplicants
  }
}
