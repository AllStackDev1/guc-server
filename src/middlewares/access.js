/**
 * Functional Module for user authentication
 * @author Chinedu Ekene Okpala  <chinedu.okpala@completefarmer.com>
 */
module.exports.name = 'hasAccess'
module.exports.dependencies = ['miscHelpers', 'response']
module.exports.factory = (helpers, response) => {
  return function (allowed = []) {
    const { APPLICANT, ADMIN } = helpers.AccessType

    return async function (req, res, next) {
      if (req.user.code) {
        if (allowed.includes(APPLICANT)) {
          next()
        } else {
          return response.forbidden(res)
        }
      } else if (allowed.includes(ADMIN)) {
        next()
      } else {
        return response.forbidden(res)
      }
    }
  }
}
