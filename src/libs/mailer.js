/* eslint-disable space-before-function-paren */
/**
 * This Factory handles sending of various kinds of emails
 * including signup and password resets
 * @author Peter Yefi
 * @created June 19, 2020
 */

module.exports.name = 'Mailer'
module.exports.dependencies = ['nodemailer', 'envs', 'email-templates', 'miscHelpers']
module.exports.factory = (nodemailer, getEnvs, Email, helpers) => {
  'use strict'

  // Get application configuration based on environment
  const envs = getEnvs(process.env.NODE_ENV)

  // helpers
  const { appRoot } = helpers

  // SMTP Mail transporter
  const transporter = nodemailer.createTransport({
    host: envs.smtpHost,
    port: envs.smtpPort,
    secure: true,
    auth: { user: envs.smtpUser, pass: envs.smtpPass }
  })

  // Email Templete Setup
  const mailer = new Email({
    views: { root: `${appRoot}/emails`, options: { extension: 'hbs' } }
  })

  /**
   * @summary
   * @param { string } to
   * @param { string } role
   * @param { string } token
   */
  const signUp = async (to, role, token) => {
    try {
      const link = `${envs.authService}/verify-account/${token}`
      const source = await mailer.render('verify', { link })
      const mailOptions = {
        from: 'Test <no-reply@test.com>',
        to,
        subject: 'Please Verify Your Email Address',
        html: source
      }
      return await transporter.sendMail(mailOptions)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    signUp
  }
}
