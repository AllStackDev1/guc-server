/**
 * @summary
 * This is the configuration file for the application enviroment variables
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */
module.exports.name = 'envs'
module.exports.dependencies = false
module.exports.factory = () => {
  'use strict'
  /**
   *
   * @param {string} env, a string representing the environment of application
   * @returns an object having configuration settings for the application
   */
  const getEnvs = env => {
    return {
      secret: process.env.SECRET,
      expiresIn: process.env.EXPIRES_IN,
      eImgLoc: process.env[`${env}_EIMG_LOC`],
      dbUrl: process.env[`${env}_DATABASE_URL`],
      dbName: process.env[`${env}_DATABASE_NAME`],
      clientUrl: process.env[`${env}_CLIENT_URL`],
      termiiKey: process.env[`${env}_TERMII_KEY`],
      mailerName: process.env[`${env}_MAILER_NAME`],
      mailerEmail: process.env[`${env}_MAILER_EMAIL`],
      termiiId: process.env[`${env}_TERMII_SENDER_ID`],
      mailJetPublic: process.env[`${env}_MAIL_JET_PUBLIC`],
      mailJetPrivate: process.env[`${env}_MAIL_JET_PRIVATE`]
    }
  }

  return getEnvs
}
