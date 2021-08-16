/* eslint-disable space-before-function-paren */
/**
 * Order Model. Defining order schema using mongoose
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */
module.exports.name = 'miscHelpers'
module.exports.dependencies = [
  'envs',
  'path',
  'lodash',
  'moment',
  'node-fetch',
  'fs-extra',
  'crypto'
]
module.exports.factory = (envs, path, lodash, moment, fetch, fs, crypto) => {
  const { isEmpty } = lodash

  // resolve app root path
  const appRoot = path.resolve('src')

  const isNotEmpty = val => !isEmpty(val)

  const getServerUrl = req => req && req.protocol + '://' + req.get('host')

  const readFile = async filePath => await fs.readFile(`${appRoot}/${filePath}`, 'utf8')

  const replaceDoubleBraces = (str, data) => {
    return str.replace(/{{(.+?)}}/g, (_, g1) => data[g1] || g1)
  }

  const formatDate = (date, format) => moment(date ? new Date(date) : new Date()).format(format)

  const leanDate = data => JSON.parse(JSON.stringify(data))

  const AccessType = {
    APPLICANT: 'APPLICANT',
    ADMIN: 'ADMIN'
  }

  const Status = {
    PENDING: 'PENDING',
    PAID: 'PAID'
  }

  // headers: { Accept: 'application/json', Authorization: authorization},
  const ajax = async (url, headers, body, method = 'GET') =>
    await fetch(url, { method, headers, body }).then(res => res.json())

  const getDate = (date, num, type) => moment(date).add(num, type).format()

  const dateTime = new Date().toISOString().slice(-24).replace(/\D/g, '').slice(0, 14)

  const getFormattedDate = date => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
  const getHash = (data, type = 'hex') => {
    return crypto
      .createHmac('sha512', envs.paystackSecretKey)
      .update(JSON.stringify(data))
      .digest(type)
  }

  return {
    ajax,
    Status,
    appRoot,
    getHash,
    getDate,
    leanDate,
    readFile,
    dateTime,
    formatDate,
    isNotEmpty,
    AccessType,
    getServerUrl,
    getFormattedDate,
    replaceDoubleBraces
  }
}
