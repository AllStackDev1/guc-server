/* eslint-disable space-before-function-paren */
/**
 * Order Model. Defining order schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

module.exports.name = 'miscHelpers'
module.exports.dependencies = ['path', 'lodash', 'moment', 'node-fetch']
module.exports.factory = (path, lodash, moment, fetch) => {
  const { isEmpty } = lodash

  // resovle app root path
  const appRoot = path.resolve('src')

  const getServerUrl = req => req && req.protocol + '://' + req.get('host')

  const isNotEmpty = val => !isEmpty(val)

  // headers: { Accept: 'application/json', Authorization: authorization},
  const ajax = async (url, headers, body, method = 'GET') =>
    await fetch(url, { method, headers, body }).then(res => res.json())

  const getDate = (date, num, type) => moment(date).add(num, type).format()

  const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 14)

  return {
    ajax,
    appRoot,
    getDate,
    dateTime,
    isNotEmpty,
    getServerUrl
  }
}
