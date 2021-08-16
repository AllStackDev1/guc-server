/**
 * Handlebars Helpers
 * @author Chinedu Ekene Okpala <chinedu.okpala@completefarmer.com>
 */

module.exports.name = 'hbsHelpers'
module.exports.dependencies = ['miscHelpers']
module.exports.factory = helpers => {
  const hbsHelper = {
    debug: val => console.log(val),
    formatDate: val => helpers.formatDate(val, 'l'),
    formatIndex: index => index + 1
  }

  return hbsHelper
}
