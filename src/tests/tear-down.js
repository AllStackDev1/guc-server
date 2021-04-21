/**
 * Tear down file to close db connection after all test cases are executed
 * @author Peter Yefi
 */

const dep = require('./init')
const debug = require('debug')('app')

suiteTeardown(() => {
  dep.authenticate
    .removeCachedUser(dep.token)
    .then(res => {
      console.log('********* user removed from cache **********')
    })
    .catch(e => {
      console.log('res')
    })
  dep.mongoose.connection.close(() => {
    debug('***************************************************')
    debug('All tests are done running. Connection to DB closed')
    debug('***************************************************')
  })
})
