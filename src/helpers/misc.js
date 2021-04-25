/* eslint-disable space-before-function-paren */
/**
 * Order Model. Defining order schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

module.exports.name = 'miscHelpers'
module.exports.dependencies = ['path', 'lodash', 'moment', 'node-fetch', 'fs-extra']
module.exports.factory = (path, lodash, moment, fetch, fs) => {
  const { isEmpty } = lodash

  // resovle app root path
  const appRoot = path.resolve('src')

  const isNotEmpty = val => !isEmpty(val)

  const readFile = async filename => await fs.readFile(`${appRoot}/email/${filename}`, 'utf8')

  const replaceDoubleBraces = (str, data) => {
    return str.replace(/{{(.+?)}}/g, (_, g1) => data[g1] || g1)
  }

  // headers: { Accept: 'application/json', Authorization: authorization},
  const ajax = async (url, headers, body, method = 'GET') =>
    await fetch(url, { method, headers, body }).then(res => res.json())

  const getDate = (date, num, type) => moment(date).add(num, type).format()

  const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 14)

  return {
    ajax,
    getDate,
    readFile,
    dateTime,
    isNotEmpty,
    replaceDoubleBraces
  }
}
