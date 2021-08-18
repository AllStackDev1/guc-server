/**
 * @summary
 * This is the configuration file for database connnections
 * It decides which database to connect to based on the environment settings
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

module.exports.name = 'db'
module.exports.dependencies = ['mongoose', 'Database', 'logger', 'log4js']
module.exports.factory = function (mongoose, Database, logger, log4js) {
  // Database configuration
  const { configureDB } = Database

  // Get connection string (We assume development environment)
  let connString = configureDB('DEV')

  if (process.env.NODE_ENV === 'TEST') {
    connString = configureDB('TEST')
  } else if (process.env.NODE_ENV === 'PROD') {
    connString = configureDB('PROD')
  }

  /**
   *
   * @param {Function} callback, function to be called when db
   * connection is opened
   * @returns db connection
   */
  const dbConfig = () => {
    const connect = () =>
      mongoose
        .connect(connString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
          connectTimeoutMS: 10000,
          writeConcern: {
            w: 'majority',
            j: true,
            wtimeout: 1000
          },
          auto_reconnect: true
        })
        .catch(error => {
          logger.debug(error)
          log4js.shutdown()
          process.exit(1)
        })

    connect()

    const db = mongoose.connection

    // Database connection events
    db.on('connected', () => {
      logger.debug('Mongoose connected')
    })

    db.on('error', err => {
      logger.debug(`Database connection error: ${err}`)
      mongoose.disconnect()
    })

    db.on('disconnected', err => {
      logger.debug(`Database disconnection error: ${err}`)
      connect()
    })

    // Close the Mongoose connection, when receiving SIGINT
    process.on('SIGINT', function () {
      db.close(() => {
        logger.debug('Force to close the MongoDB connection after SIGINT')
        process.exit(0)
      })
    })

    return db
  }

  return { dbConfig }
}
