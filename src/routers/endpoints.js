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
  'StudentBackgroundController',
  'StudentBackgroundValidations',
  'SiblingController',
  'SiblingValidations',
  'HealthAndMedicalController',
  'HealthAndMedicalValidations',
  'GuardianContactInformationController',
  'GuardianContactInformationValidations',
  'EmergencyContactController',
  'EmergencyContactValidations',
  'DownloadListController',
  'DownloadListValidations',
  'ScheduleTestController',
  'ScheduleTestValidations',
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
  StudentBackgroundController,
  StudentBackgroundValidations,
  SiblingController,
  SiblingValidations,
  HealthAndMedicalController,
  HealthAndMedicalValidations,
  GuardianContactInformationController,
  GuardianContactInformationValidations,
  EmergencyContactController,
  EmergencyContactValidations,
  DownloadListController,
  DownloadListValidations,
  ScheduleTestController,
  ScheduleTestValidations,
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
      route: 'applicants-details',
      methods: ['post'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([ADMIN]),
          ApplicantValidations.querySearch2,
          ApplicantController.fetchAllApplicantDetails
        ]
      }
    },
    {
      route: 'applicants/result',
      methods: ['get'],
      guard: true,
      middlewares: {
        get: [hasAccess([APPLICANT]), ApplicantController.getResultFile]
      }
    },
    {
      route: 'applicants/with/result',
      methods: ['get'],
      guard: true,
      middlewares: {
        get: [hasAccess([ADMIN]), ApplicantController.getApplicantWithResult]
      }
    },
    {
      route: 'applicants/bulk-delete',
      methods: ['post'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([ADMIN]),
          ApplicantValidations.deleteApplicants,
          ApplicantController.deleteApplicants
        ]
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
        get: [hasAccess([ADMIN]), MiscValidations.id, ApplicantController.fetchApplicantDetails],
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
          hasAccess([APPLICANT]),
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
        delete: [hasAccess([ADMIN]), MiscValidations.id, InitialEnquiryController.delete]
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
          hasAccess([APPLICANT]),
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
          PreviousSchoolController.preUpdate,
          MiscValidations.id,
          PreviousSchoolValidations.put,
          PreviousSchoolController.update
        ],
        delete: [hasAccess([APPLICANT, ADMIN]), MiscValidations.id, PreviousSchoolController.delete]
      }
    },
    // #endregion

    // #region STUDENT BACKGROUND ENDPOINTS
    {
      route: 'student-backgrounds',
      methods: ['post', 'get'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([APPLICANT]),
          StudentBackgroundController.preInsert,
          StudentBackgroundValidations.post,
          StudentBackgroundController.insert
        ],
        get: [
          hasAccess([APPLICANT, ADMIN]),
          StudentBackgroundController.preGet,
          StudentBackgroundValidations.querySearch,
          StudentBackgroundController.getOne
        ]
      }
    },
    {
      route: 'student-backgrounds/:id',
      methods: ['put', 'delete'],
      guard: true,
      middlewares: {
        put: [
          hasAccess([APPLICANT, ADMIN]),
          MiscValidations.id,
          StudentBackgroundValidations.put,
          StudentBackgroundController.update
        ],
        delete: [hasAccess([ADMIN]), MiscValidations.id, StudentBackgroundController.delete]
      }
    },
    // #endregion

    // #region SIBLINGS ENDPOINTS
    {
      route: 'siblings',
      methods: ['post', 'get'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([APPLICANT]),
          SiblingController.preInsert,
          SiblingValidations.post,
          SiblingController.insert
        ],
        get: [
          hasAccess([APPLICANT, ADMIN]),
          SiblingController.preGet,
          SiblingValidations.querySearch,
          SiblingController.get
        ]
      }
    },
    {
      route: 'siblings/:id',
      methods: ['put', 'delete'],
      guard: true,
      middlewares: {
        put: [
          hasAccess([APPLICANT, ADMIN]),
          SiblingController.preUpdate,
          MiscValidations.id,
          SiblingValidations.put,
          SiblingController.update
        ],
        delete: [hasAccess([APPLICANT, ADMIN]), MiscValidations.id, SiblingController.delete]
      }
    },
    // #endregion

    // #region HEALTH AND MEDICAL ENDPOINTS
    {
      route: 'healths-and-medicals',
      methods: ['post', 'get'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([APPLICANT]),
          HealthAndMedicalController.preInsert,
          HealthAndMedicalValidations.post,
          HealthAndMedicalController.insert
        ],
        get: [
          hasAccess([APPLICANT, ADMIN]),
          HealthAndMedicalController.preGet,
          HealthAndMedicalValidations.querySearch,
          HealthAndMedicalController.getOne
        ]
      }
    },
    {
      route: 'healths-and-medicals/:id',
      methods: ['put', 'delete'],
      guard: true,
      middlewares: {
        put: [
          hasAccess([APPLICANT, ADMIN]),
          MiscValidations.id,
          HealthAndMedicalValidations.put,
          HealthAndMedicalController.update
        ],
        delete: [
          hasAccess([APPLICANT, ADMIN]),
          MiscValidations.id,
          HealthAndMedicalController.delete
        ]
      }
    },
    // #endregion

    // #region GUARDING CONTACT INFORMATION ENDPOINTS
    {
      route: 'guardian-contact-informations',
      methods: ['post', 'get'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([APPLICANT]),
          GuardianContactInformationController.preInsert,
          GuardianContactInformationValidations.post,
          GuardianContactInformationController.insert
        ],
        get: [
          hasAccess([APPLICANT, ADMIN]),
          GuardianContactInformationController.preGet,
          GuardianContactInformationValidations.querySearch,
          GuardianContactInformationController.getOne
        ]
      }
    },
    {
      route: 'guardian-contact-informations/:id',
      methods: ['put', 'delete'],
      guard: true,
      middlewares: {
        put: [
          hasAccess([APPLICANT]),
          MiscValidations.id,
          GuardianContactInformationValidations.put,
          GuardianContactInformationController.update
        ],
        delete: [
          hasAccess([APPLICANT, ADMIN]),
          MiscValidations.id,
          GuardianContactInformationController.delete
        ]
      }
    },
    // #endregion

    // #region EMERGENCY CONTACT ENDPOINTS
    {
      route: 'emergency-contacts',
      methods: ['post', 'get'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([APPLICANT]),
          EmergencyContactController.preInsert,
          EmergencyContactValidations.post,
          EmergencyContactController.insert
        ],
        get: [
          hasAccess([APPLICANT, ADMIN]),
          EmergencyContactController.preGet,
          EmergencyContactValidations.querySearch,
          EmergencyContactController.getOne
        ]
      }
    },
    {
      route: 'emergency-contacts/:id',
      methods: ['put', 'delete'],
      guard: true,
      middlewares: {
        put: [
          hasAccess([APPLICANT, ADMIN]),
          MiscValidations.id,
          EmergencyContactValidations.put,
          EmergencyContactController.update
        ],
        delete: [
          hasAccess([APPLICANT, ADMIN]),
          MiscValidations.id,
          EmergencyContactController.delete
        ]
      }
    },
    // #endregion

    // #region DOWNLOAD LIST ENDPOINTS
    {
      route: 'download-lists',
      methods: ['post', 'get'],
      guard: true,
      middlewares: {
        post: [hasAccess([ADMIN]), DownloadListValidations.post, DownloadListController.insert],
        get: [hasAccess([ADMIN]), DownloadListController.fetch]
      }
    },
    {
      route: 'download-lists/bulk-delete',
      methods: ['post'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([ADMIN]),
          DownloadListValidations.deleteDownloadLists,
          DownloadListController.deleteDownloadLists
        ]
      }
    },
    {
      route: 'download-lists/drop',
      methods: ['delete'],
      guard: true,
      middlewares: {
        delete: [hasAccess([ADMIN]), DownloadListController.drop]
      }
    },
    {
      route: 'download-lists/:id',
      methods: ['put', 'delete'],
      guard: true,
      middlewares: {
        put: [
          hasAccess([ADMIN]),
          MiscValidations.id,
          DownloadListValidations.put,
          DownloadListController.update
        ],
        delete: [hasAccess([ADMIN]), MiscValidations.id, DownloadListController.delete]
      }
    },
    // #endregion

    // #region SCHEDULE TEST ENDPOINTS
    {
      route: 'schedule-tests',
      methods: ['post', 'get'],
      guard: true,
      middlewares: {
        post: [hasAccess([ADMIN]), ScheduleTestValidations.post, ScheduleTestController.insert],
        get: [hasAccess([APPLICANT, ADMIN]), ScheduleTestController.fetch]
      }
    },
    {
      route: 'schedule-tests/bulk-delete',
      methods: ['post'],
      guard: true,
      middlewares: {
        post: [
          hasAccess([ADMIN]),
          ScheduleTestValidations.deleteScheduleTests,
          ScheduleTestController.deleteScheduleTests
        ]
      }
    },
    {
      route: 'schedule-tests/drop',
      methods: ['delete'],
      guard: true,
      middlewares: {
        delete: [hasAccess([ADMIN]), ScheduleTestController.drop]
      }
    },
    {
      route: 'schedule-tests/:id',
      methods: ['put', 'delete'],
      guard: true,
      middlewares: {
        put: [
          hasAccess([ADMIN]),
          MiscValidations.id,
          ScheduleTestValidations.put,
          ScheduleTestController.update
        ],
        delete: [hasAccess([ADMIN]), MiscValidations.id, ScheduleTestController.delete]
      }
    }
    // #endregion
  ]
}
