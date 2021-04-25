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
  'MiscValidations'
]
module.exports.factory = (
  AdminController,
  AdminValidations,
  ApplicantController,
  ApplicantValidations,
  MiscValidations
) => {
  /**
   * @param { string } route defination
   * @param { Array<'post' || 'get'|| 'patch'|| 'put' || 'delete' >} methods allowed on a route
   * @param { bool } guard toggle for authentication
   * @param { { post: Array<Function>, get: Array<Function>, patch: Array<Function>, put: Array<Function>, delete: Array<Function> } } middlewares request handlers
   */
  return [
    // #region STUDENT ROUTE
    {
      route: 'enroll',
      methods: ['post'],
      middlewares: {
        post: [ApplicantValidations.enroll, ApplicantController.insert]
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
    // #endregion

    // #region ADMIN ROUTE
    {
      route: 'login',
      methods: ['post'],
      middlewares: {
        post: [AdminValidations.login, AdminController.login]
      }
    },
    {
      route: 'create',
      methods: ['post'],
      // guard: true,
      // guardType: 'admin',
      middlewares: {
        post: [AdminValidations.create, AdminController.insert]
      }
    },
    {
      route: 'applicants',
      methods: ['get'],
      guard: true,
      guardType: 'admin',
      middlewares: {
        get: [ApplicantValidations.querySearch, ApplicantController.get]
      }
    },
    {
      route: 'applicants/:id',
      methods: ['get', 'patch', 'delete'],
      guard: true,
      guardType: 'admin',
      middlewares: {
        get: [MiscValidations.id, ApplicantController.getById],
        patch: [MiscValidations.id, ApplicantController.update],
        delete: [MiscValidations.id, ApplicantController.delete]
      }
    }
    // #endregion
  ]
}
