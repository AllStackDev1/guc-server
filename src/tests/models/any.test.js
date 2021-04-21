/**
 * This module contains unit test for user model
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

const assert = require('chai').assert
// import test dependencies
const testDependencies = require('../init.js')
// import entity under test
const AnyModel = testDependencies.AnyModel

/**
 * Test Suite for block Model
 */
suite('Any Model Test Suites', () => {
  // Test testAny object
  const testAny = {
    name: 'yarm block'
  }

  test('Should not save without a name', () => {
    delete testAny.name
    const any = new AnyModel(testAny)
    any.validate(err => {
      assert.equal(err.errors.name, 'Any name is required')
    })
  })

  test('Should save any', () => {
    testAny.name = 'arable'
    const any = new AnyModel(testAny)
    any.validate(err => {
      assert.equal(err, null)
    })
  })
})
