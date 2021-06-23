/**
 * @summary
 * This is the configuration file for the application enviroment variables
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */
module.exports.name = 'envs'
module.exports.dependencies = false
module.exports.factory = () => {
  'use strict'
  /**
   *
   * @param {string} env, a string representing the environment of application
   * @returns an object having configuration settings for the application
   */
  return {
    secret: process.env.SECRET || 'GCUSc4001',
    expiresIn: process.env.EXPIRES_IN,
    eImgLoc: 'https://gcu.sch.ng/images/email',
    dbUrl: process.env.DATABASE_URL,
    dbName: process.env.DATABASE_NAME,
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
    clientUrl: process.env.CLIENT_URL,
    termiiKey: process.env.TERMII_KEY,
    mailerName: process.env.MAILER_NAME,
    mailerEmail: process.env.MAILER_EMAIL,
    termiiId: process.env.TERMII_SENDER_ID,
    twilioPhoneNo: process.env.TWILIO_PHONE_NO,
    mailJetPublic: process.env.MAIL_JET_PUBLIC,
    mailJetPrivate: process.env.MAIL_JET_PRIVATE,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
    twilioVerificationSID: process.env.TWILIO_VERIFICATION_SERVICE_SID
  }
}
