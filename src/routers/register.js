/**
 * @summary
 * This modules represents the router modules which defines
 * all the routes (endpoints) in this application
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

module.exports.name = 'routers'
module.exports.dependencies = ['express', 'passport', 'swagger-ui-express', 'response', 'endpoints']
module.exports.factory = (express, passport, swaggerUi, response, endpoints) => {
  // init express router
  const router = express.Router()

  router.use(passport.initialize())

  // Add Swagger API Documentation
  const swaggerDocument = require('../swagger.json')

  const auth = (req, res, next) => passport.authenticate('jwt', { session: false })(req, res, next)

  // register all routes here
  router.use('/api-docs', swaggerUi.serve)
  endpoints.forEach(endpoint => {
    endpoint.methods.forEach(method => {
      router[method](
        `/${endpoint.route}`,
        endpoint.guard ? auth : (req, res, next) => next(),
        ...endpoint.middlewares[method]
      )
    })
    router.all(`/${endpoint.route}`, (req, res) => response.methodNotAllowed(res))
  })
  router.get('/api-docs', swaggerUi.setup(swaggerDocument))
  router.all('*', (req, res) => response.notFound(res))

  return router
}
