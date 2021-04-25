/* eslint-disable space-before-function-paren */
/**
 * This Factory handles sending of various kinds of emails
 * including signup and password resets
 * @author Peter Yefi
 * @created June 19, 2020
 */

module.exports.name = 'Mailer'
module.exports.dependencies = ['node-mailjet', 'envs', 'miscHelpers']
module.exports.factory = (mailJet, getEnvs, helpers) => {
  'use strict'
  const { connect, Email } = mailJet

  // Get application configuration based on environment
  const envs = getEnvs(process.env.NODE_ENV)

  const mailjet = connect(envs.mailJetPublic || '', envs.mailJetPrivate || '')

  /**
   * @summary
   * @param { string } mail
   */
  const sendMail = async mail => {
    try {
      // await mailSchema.validateAsync(mail)
      const message = {
        From: {
          Name: envs.mailerName || 'Zeedas',
          Email: envs.mailerEmail || 'service-noreply@zeedas.com'
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
        message['ReplyTo'] = {
          Email: mail.replyTo
        }
      }
      if (mail.name) {
        message.To[0]['Name'] = mail.name
      }
      return await this.mailJet.post('send', { version: 'v3.1' }).request({
        Messages: [message]
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
