/* eslint-disable space-before-function-paren */
/**
 * This factory handles sending and verification of otp using service from Termii
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'Twilio'
module.exports.dependencies = ['twilio', 'envs']
module.exports.factory = (twilio, getEnvs) => {
  'use strict'

  // Get application configuration based on environment
  const { twilioAuthToken, twilioAccountSID, twilioVerificationSID } = getEnvs
  const client = twilio(twilioAccountSID, twilioAuthToken)

  /**
   * @summary function to send otp
   * @param { string } to
   */
  const sendOtp = async to => {
    return await client.verify
      .services(twilioVerificationSID)
      .verifications.create({ to, channel: 'sms' })
  }

  /**
   * @summary function to verify otp
   * @param { {to: string, code: string} } payload
   */
  const verifyOtp = async payload => {
    return client.verify.services(twilioVerificationSID).verificationChecks.create(payload)
  }

  return { sendOtp, verifyOtp }
}
