/**
 * This module contains integration tests for user repository
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */

process.env.NODE_ENV = 'TEST'
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

// import test dependencies
const testDependencies = require('../init.js')

// import entity under test
const AnyRepoInstance = testDependencies.AnyRepoInstance

// Any ID
let AnyID = null

/**
 * Test Suite for Any Repository
 */
suite('Any Repository Test Suites', () => {
  // Test payload object
  const payload = {
    name: 'testAny',
    description: 'justdescription'
  }

  test('Should not create an Any without a name', () => {
    delete payload.name
    return Promise.resolve(AnyRepoInstance.insert(payload)).catch(error => {
      error.message.should.equal('Any validation failed: name: Any name is required')
    })
  })

  test('Should create a new Any', () => {
    payload.description = 'justdescription'
    return Promise.resolve(AnyRepoInstance.insert(payload)).then(res => {
      AnyID = res._id
      expect(res.name).to.eql('testAny')
    })
  })

  test('Should retrieve an Any with a given id', () => {
    return Promise.resolve(AnyRepoInstance.getById(AnyID)).then(result => {
      expect(result.name).to.eql('testAny')
    })
  })

  test('Should update Any with given id', () => {
    const newPayload = {
      name: 'newTestAny'
    }
    return Promise.resolve(AnyRepoInstance.update(AnyID, newPayload)).then(result => {
      expect(result.name).to.equal('newTestAny')
    })
  })

  test('Should get all Any records', () => {
    return Promise.resolve(AnyRepoInstance.get()).then(result => {
      expect(result.length).to.equal(1)
    })
  })

  test('Should delete an Any record given the id', () => {
    return Promise.resolve(AnyRepoInstance.delete(AnyID)).then(result => {
      expect(typeof result).to.equal('object')
    })
  })

  /**
   * Make sure database is in original state after this test
   */
  suiteTeardown(() => {
    const AnyCollection = testDependencies.mongoose.connection.collection('any_model')
    AnyCollection.deleteOne({ _id: AnyID }, (err, res) => {
      if (err) console.log(err)
      console.log(`Deleted ${res.result.n} Any record(s)`)
    })
  })
})
