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
      dbUrl: process.env[`${env}_DATABASE_URL`],
      dbName: process.env[`${env}_DATABASE_NAME`],
      awsId: process.env.AWS_ACCESS_KEY_ID,
      awsSecret: process.env.AWS_SECRET_ACCESS_KEY,
      awsRegion: process.env.AWS_REGION,
      secret: process.env.SECRET,
      expiresIn: process.env.EXPIRES_IN,
      redisPass: process.env.REDIS_PASS
    }
  }

  return getEnvs
}
