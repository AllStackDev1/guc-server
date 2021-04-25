/**
 * Module to bootstrap the application and include necessary components
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */
module.exports.name = 'bootstrap'
module.exports.dependencies = [
  'express',
  'cors',
  'helmet',
  'morgan',
  'body-parser',
  'celebrate',
  'db',
  'routers',
  'logger',
  'response'
]
module.exports.factory = (
  express,
  cors,
  helmet,
  morgan,
  bodyParser,
  celebrate,
  db,
  routers,
  logger,
  response
) => {
  'use strict'

  // database configuration
  const { dbConfig } = db

  // error handler
  const { errors } = celebrate

  // application server
  const app = express()
  const port = process.env.PORT || 3000

  // register necessary middleware
  app.use(cors())
  app.options('*', cors())
  app.use(helmet())
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
  app.use(bodyParser.json({ limit: '5mb', extended: true }))
  app.use(express.urlencoded({ extended: true }))
  if (app.get('env') === 'DEV') {
    app.use(morgan('combined'))
  }

  // server error middleware
  app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
      response.serverError(res, 'Invalid data')
    } else {
      next()
    }
  })

  // register routes middleware
  app.use('/api/v1', routers)
  app.get('/', (req, res) => res.redirect('/api/v1/api-docs'))

  // register celebrate validation middleware
  app.use(errors())

  // connect to the database and if successful, start the server
  dbConfig(() => {
    app.listen(port, () => {
      logger.debug(`Express server listening on port ${port}`)
      logger.debug(`You should be able to connect to the api on http://localhost:${port}`)
    })
  })

  return app
}
