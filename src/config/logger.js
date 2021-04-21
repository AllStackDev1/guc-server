/**
 * @summary
 * This is the configuration file for the applicaiton logger
 * It debugs messages to the console and logs error to a file in the logs/
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

module.exports.name = 'logger'
module.exports.dependencies = ['log4js']
module.exports.factory = log4js => {
  'use strict'

  // application debugger
  const debug = require('debug')('app')

  /**
   * Configure logger for the application
   */
  const getLogger = () => {
    log4js.configure({
      appenders: {
        errors: {
          type: 'file',
          filename: './logs/name_of_app_api_errors.log',
          maxLogSize: 10485760,
          backups: 3,
          compress: true
        }
      },
      categories: {
        default: { appenders: ['errors'], level: 'error' }
      }
    })

    return log4js.getLogger()
  }

  return { getLogger, debug }
}
