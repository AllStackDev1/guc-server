/**
 * This module contains integration tests for user controller
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

// import test dependencies
const testDependencies = require('../init.js')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const request = require('supertest')(testDependencies.bootstrap)
chai.use(chaiAsPromised)
chai.should()

/**
 * Test Suite for Any Controller
 */
suite('Any Controller Test Suites', () => {
  // API Token
  const token = testDependencies.token

  // Base API URL
  const apiBase = '/api/v1'

  // Any ID
  let AnyID = null
  // Test Any object
  const Any = {
    name: 'any name'
  }

  // #region CREATING A NEW Any

  test('Should create a new Any', () => {
    return request
      .post(`${apiBase}/Anys`)
      .set('Authorization', 'Bearer ' + token)
      .send(Any)
      .expect(201)
      .expect(res => {
        AnyID = res.body.data._id
        res.body.data.name.should.equal('any name')
      })
  })

  test('Should get an Any by its ID', () => {
    return request
      .get(`${apiBase}/anys/${AnyID}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect(res => {
        res.body.data.name.should.equal('any name')
      })
  })

  /**
   * Make sure database is in original state after this test
   */
  test('Should delete this Any record created', () => {
    return request
      .delete(`${apiBase}/Anys/${AnyID}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect(res => {
        res.body.data.name.should.equal('any name')
      })
  })
})
