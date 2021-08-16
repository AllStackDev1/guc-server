module.exports.name = 'PDF'
module.exports.dependencies = ['puppeteer', 'query-string', 'miscHelpers']
module.exports.factory = (puppeteer, queryString, helpers) => {
  'use strict'

  // helpers
  const { getServerUrl } = helpers

  const init = async (req, data) => {
    try {
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
      const page = await browser.newPage()
      const url = `${getServerUrl(req)}/api/v1/pdf-${data.type}/${
        req.params.id
      }?${queryString.stringify(data)}`
      await page.goto(url, { waitUntil: 'networkidle0' })
      const buffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false,
        margin: 0,
        padding: 0
      })
      const base64 = buffer.toString('base64')
      await browser.close()
      return `data:application/pdf;base64,${base64}`
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return init
}
