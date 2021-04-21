/**
 * @summary
 * This modules represents the endpoints construct for admin related API request.
 * All middlewares required for each endpoint methods are resgistered here
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

module.exports.name = 'endpoints'
module.exports.dependencies = [
  'UserController',
  'UserValidations',
  'MiscValidations',
  'Uploader',
  'miscHelpers'
]
module.exports.factory = (UserController, UserValidations, MiscValidations, uploader, helper) => {
  /**
   * @param { string } route defination
   * @param { Array<'post' || 'get'|| 'patch'|| 'put' || 'delete' >} methods allowed on a route
   * @param { bool } guard toggle for authentication
   * @param { { post: Array<Function>, get: Array<Function>, patch: Array<Function>, put: Array<Function>, delete: Array<Function> } } middlewares request handlers
   */

  return [
    // #region User ROUTE
    {
      route: 'signup',
      methods: ['post'],
      middlewares: {
        post: [UserValidations.post, UserController.insert]
      }
    },
    {
      route: 'verify-account/:token',
      methods: ['patch'],
      middlewares: {
        patch: [UserValidations.paramsQuery, UserController.verifyAccount]
      }
    },
    {
      route: 'login',
      methods: ['post'],
      middlewares: {
        post: [UserValidations.login, UserController.login]
      }
    },
    {
      route: 'Users',
      methods: ['get'],
      guard: true,
      middlewares: {
        get: [UserValidations.querySearch, UserController.get]
      }
    },
    {
      route: 'Users/:id',
      methods: ['get', 'delete'],
      guard: true,
      middlewares: {
        get: [MiscValidations.id, UserController.getById],
        delete: [MiscValidations.id, UserController.delete]
      }
    }
    // #endregion
  ]
}
