/**
 * Functional Module for user authentication
 * @author Chinedu Ekene Okpala  <chinedu.okpala@completefarmer.com>
 */
module.exports.name = 'auth'
module.exports.dependencies = ['jsonwebtoken', 'envs', 'response']
module.exports.factory = (jwt, getEnvs, response) => {
  const { secret } = getEnvs

  return function (passport, type) {
    return async function (req, res, next) {
      if (type === 'admin') {
        return passport.authenticate('jwt', { session: false })(req, res, next)
      } else {
        try {
          const token = req.headers.authorization.split(' ')[1]
          const applicant = await jwt.verify(token, secret)
          req.token = token
          req.user = applicant
          next()
        } catch (error) {
          return response.unauthorized(res)
        }
      }
    }
  }
}
