/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @summary
 * This modules represents the response modules which defines
 * all the response (res) in this application
 */

module.exports.name = 'Validator'
module.exports.dependencies = ['bcryptjs', 'jsonwebtoken']
module.exports.factory = (bcrypt, jwt) => {
  'use strict'

  const verifyToken = param => {
    return new Promise(async (resolve, reject) => {
      const message = 'Failed to authenticate link. Link may be damaged, Please contact support!'
      try {
        const decoded = await jwt.verify(param.token, envs.jwtSecret)
        if (decoded.access !== param.access) reject({ message })
        resolve(decoded._id)
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          const decoded = await jwt.verify(param.token, envs.jwtSecret, { ignoreExpiration: true })
          reject({ _id: decoded._id, message })
        } else {
          reject({ message })
        }
      }
    })
  }

  return { verifyToken }
}
