/* eslint-disable space-before-function-paren */
/**
 * This factory handles sending and verification of otp using service from Termii
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @created April 21, 2021
 */

module.exports.name = 'Termii'
module.exports.dependencies = ['envs', 'miscHelpers']
module.exports.factory = (getEnvs, helpers) => {
  'use strict'

  // Get application configuration based on environment
  const { termiiId, termiiKey } = getEnvs
  const { ajax } = helpers

  const TERMII_URL = 'https://termii.com/api/sms/otp'

  /**
   * @summary function to send otp
   * @param { string } phone
   */
  const sendOtp = async to => {
    const data = {
      api_key: termiiKey,
      message_type: 'NUMERIC',
      to,
      from: 'G.C.U' || termiiId,
      channel: 'generic',
      pin_attempts: 4,
      pin_time_to_live: 5,
      pin_length: 6,
      pin_placeholder: '< 1234 >',
      message_text: 'Your one time pin is < 1234 >',
      pin_type: 'NUMERIC'
    }
    const headers = {
      'Content-Type': ['application/json', 'application/json']
    }
    return await ajax(`${TERMII_URL}/send`, headers, JSON.stringify(data), 'POST')
  }

  /**
   * @summary function to verify otp
   * @param { string } phone
   */
  const verifyOtp = async payload => {
    const data = { api_key: termiiKey, ...payload }
    const headers = {
      'Content-Type': ['application/json', 'application/json']
    }
    return await ajax(`${TERMII_URL}/verify`, headers, JSON.stringify(data), 'POST')
  }

  return { sendOtp, verifyOtp }
}
