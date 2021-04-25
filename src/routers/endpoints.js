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
  'StudentController',
  'StudentValidations',
  'MiscValidations'
]
module.exports.factory = (
  AdminController,
  AdminValidations,
  StudentController,
  StudentValidations,
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
        post: [StudentValidations.enroll, StudentController.insert]
      }
    },
    {
      route: 'auth',
      methods: ['post'],
      middlewares: {
        post: [StudentValidations.auth, StudentController.auth]
      }
    },
    {
      route: 'otp-verification',
      methods: ['post'],
      middlewares: {
        post: [StudentValidations.otpVerification, StudentController.otpVerification]
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
      guard: true,
      guardType: 'admin',
      middlewares: {
        post: [AdminValidations.create, AdminController.insert]
      }
    },
    {
      route: 'students',
      methods: ['get'],
      guard: true,
      guardType: 'admin',
      middlewares: {
        get: [StudentValidations.querySearch, StudentController.get]
      }
    },
    {
      route: 'students/:id',
      methods: ['get', 'patch', 'delete'],
      guard: true,
      guardType: 'admin',
      middlewares: {
        get: [MiscValidations.id, StudentController.getById],
        patch: [MiscValidations.id, StudentController.update],
        delete: [MiscValidations.id, StudentController.delete]
      }
    }
    // #endregion
  ]
}
