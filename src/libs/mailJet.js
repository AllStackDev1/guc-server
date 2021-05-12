/* eslint-disable space-before-function-paren */
/**
 * This Factory handles sending of various kinds of emails
 * including signup and password resets
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'MailJet'
module.exports.dependencies = ['node-mailjet', 'envs', 'logger', 'miscHelpers']
module.exports.factory = (nodeMailJet, getEnvs, logger, helpers) => {
  'use strict'
  const { connect } = nodeMailJet
  const { readFile, replaceDoubleBraces } = helpers

  // Get application configuration based on environment
  const { mailJetPublic, mailJetPrivate, mailerName, mailerEmail } = getEnvs(process.env.NODE_ENV)

  const mailJet = connect(mailJetPublic, mailJetPrivate)

  /**
   * @summary
   * @param { string } mail
   */
  const sendMail = async mail => {
    try {
      const message = {
        From: {
          Name: mailerName,
          Email: mailerEmail
        },
        Subject: mail.subject,
        HTMLPart: mail.content,
        To: [
          {
            Email: mail.email
          }
        ]
      }

      if (mail.replyTo) {
        message.ReplyTo = {
          Email: mail.replyTo
        }
      }

      if (mail.name) {
        message.To[0].Name = mail.name
      }

      return await mailJet.post('send', { version: 'v3.1' }).request({
        Messages: [message]
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const applicationCodeEmail = async ({ data, ...rest }) => {
    try {
      const html = await readFile('email-templates/application-code.html')
      const content = replaceDoubleBraces(html, data)
      return await sendMail({ ...rest, subject: 'Application code', content })
    } catch (error) {
      logger.getLogger().error(error)
    }
  }

  const welcomeEmail = async ({ data, ...rest }) => {
    try {
      const html = await readFile('email-templates/welcome-email.html')
      const content = replaceDoubleBraces(html, data)
      return await sendMail({ ...rest, subject: 'Welcome Email', content })
    } catch (error) {
      logger.getLogger().error(error)
    }
  }

  const scheduleTest = async ({ data, ...rest }) => {
    try {
      const html = await readFile('email-templates/schedule-test.html')
      const content = replaceDoubleBraces(html, data)
      return await sendMail({ ...rest, subject: 'Test Scheduled', content })
    } catch (error) {
      logger.getLogger().error(error)
    }
  }

  return { applicationCodeEmail, welcomeEmail, scheduleTest }
}
