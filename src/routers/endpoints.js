/**
 * @summary
 * This modules represents the endpoints construct for admin related API request.
 * All middlewares required for each endpoint methods are resgistered here
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

module.exports.name = 'endpoints'
module.exports.dependencies = [
  'AdminController',
  'AdminValidations',
  'ApplicantController',
  'ApplicantValidations',
  'InitialEnquiryController',
  'InitialEnquiryValidations',
  'PreviousSchoolController',
  'PreviousSchoolValidations',
  'MiscValidations',
  'hasAccess',
  'miscHelpers'
]
module.exports.factory = (
  AdminController,
  AdminValidations,
  ApplicantController,
  ApplicantValidations,
  InitialEnquiryController,
  InitialEnquiryValidations,
  PreviousSchoolController,
  PreviousSchoolValidations,
  MiscValidations,
  hasAccess,
  Helpers
) => {
  const { APPLICANT, ADMIN } = Helpers.AccessType
  /**
   * @param { string } route defination
   * @param { Array<'post' || 'get'|| 'patch'|| 'put' || 'delete' >} methods allowed on a route
   * @param { bool } guard toggle for authentication
   * @param { { post: Array<Function>, get: Array<Function>, patch: Array<Function>, put: Array<Function>, delete: Array<Function> } } middlewares request handlers
   */
  return [
    // #region APPLICANT AUTH ENDPOINTS
    {
      route: 'enroll',
      methods: ['post'],
      middlewares: {
        post: [
          ApplicantValidations.enroll,
          ApplicantController.preInsert,
          ApplicantController.insert
        ]
      }
    },
    {
      route: 'resend-code',
      methods: ['post'],
      middlewares: {
        post: [ApplicantValidations.resendCode, ApplicantController.resendCode]
      }
    },
    {
      route: 'auth',
      methods: ['post'],
      middlewares: {
        post: [ApplicantValidations.auth, ApplicantController.auth]
      }
    },
    {
      route: 'verify-otp',
      methods: ['post'],
      middlewares: {
        post: [ApplicantValidations.verifyOTP, ApplicantController.verifyOTP]
      }
    },
    {
      route: 'applicants',
      methods: ['get'],
      guard: true,
      middlewares: {
        get: [hasAccess([ADMIN]), ApplicantValidations.querySearch, ApplicantController.get]
      }
    },
    {
      route: 'applicants/update-profile',
      methods: ['patch'],
      guard: true,
      middlewares: {
        patch: [hasAccess([APPLICANT]), ApplicantValidations.patch, ApplicantController.update]
      }
    },
    {
      route: 'applicants/:id',
      methods: ['get', 'patch', 'delete'],
      guard: true,
      middlewares: {
        get: [hasAccess([ADMIN]), MiscValidations.id, ApplicantController.getById],
        patch: [hasAccess([ADMIN]), MiscValidations.id, ApplicantController.update],
        delete: [hasAccess([ADMIN]), MiscValidations.id, ApplicantController.delete]
      }
    },
    // #endregion

    // #region ADMIN AUTH ENDPOINTS
    {
      route: 'login',
      methods: ['post'],
      middlewares: {
        post: [AdminValidations.login, AdminController.login]
      }
    },
    {
      route: 'admin',
      methods: ['post', 'get'],
      guard: true,
      middlewares: {
        post: [hasAccess([ADMIN]), AdminValidations.create, AdminController.insert],
        get: [hasAccess([ADMIN]), AdminController.get]
      }
    },
    {
      route: 'admin/update-profile',
      methods: ['patch'],
      guard: true,
      middlewares: {
        patch: [hasAccess([ADMIN]), AdminValidations.patch, AdminController.update]
      }
    },
    // #endregion

    // #region INITIAL ENQUIRIES ENDPOINTS
    {
      route: 'initial-enquiries',
      methods: ['post', 'get'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([APPLICANT, ADMIN]),
          InitialEnquiryController.preInsert,
          InitialEnquiryValidations.post,
          InitialEnquiryController.insert
        ],
        get: [
          hasAccess([APPLICANT, ADMIN]),
          InitialEnquiryController.preGet,
          InitialEnquiryValidations.querySearch,
          InitialEnquiryController.getOne
        ]
      }
    },
    {
      route: 'initial-enquiries/:id',
      methods: ['put', 'delete'],
      guard: true,
      middlewares: {
        put: [
          hasAccess([APPLICANT, ADMIN]),
          MiscValidations.id,
          InitialEnquiryValidations.put,
          InitialEnquiryController.update
        ],
        delete: [hasAccess([APPLICANT, ADMIN]), MiscValidations.id, InitialEnquiryController.delete]
      }
    },
    // #endregion

    // #region PREVIOUS SCHOOL ENDPOINTS
    {
      route: 'previous-schools',
      methods: ['post', 'get'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([APPLICANT, ADMIN]),
          PreviousSchoolController.preInsert,
          PreviousSchoolValidations.post,
          PreviousSchoolController.insert
        ],
        get: [
          hasAccess([APPLICANT, ADMIN]),
          PreviousSchoolController.preGet,
          PreviousSchoolValidations.querySearch,
          PreviousSchoolController.get
        ]
      }
    },
    {
      route: 'previous-schools/:id',
      methods: ['put', 'delete'],
      guard: true,
      middlewares: {
        put: [
          hasAccess([APPLICANT, ADMIN]),
          MiscValidations.id,
          PreviousSchoolValidations.put,
          PreviousSchoolController.update
        ],
        delete: [hasAccess([APPLICANT, ADMIN]), MiscValidations.id, PreviousSchoolController.delete]
      }
    }
    // #endregion
  ]
}
