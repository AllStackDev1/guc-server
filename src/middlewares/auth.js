/**
 * Functional Module for user authentication
 * @author Chinedu Ekene Okpala  <chinedu.okpala@completefarmer.com>
 */
module.exports.name = 'auth'
module.exports.dependencies = ['passport', 'jsonwebtoken', 'envs', 'response']
module.exports.factory = (passport, jwt, getEnvs, response) => {
  const { secret } = getEnvs(process.env.NODE_ENV)

  return function (type) {
    return async function (req, res, next) {
      if (type) {
        if (type === 'admin') {
          return passport.authenticate('jwt', { session: false })
        } else {
          try {
            await jwt.verify(req.token, secret)
            next()
          } catch (error) {
            return response.unauthorized(res)
          }
        }
      } else {
        return response.forbidden(res)
      }
    }
  }
}
