/**
  Handles the testing database. Require in all tests using the database.
  Clears db before each test and closes the connection afterwards.
*/
var map = require('lodash.map')
const models = require('../domain/models')
const connection = require('../domain/models').sequelize // Needs to be closed after running tests

beforeAll(async (done) => {
  // Clear test database before running tests
  await Promise.all(
    map(Object.keys(models), (key) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null
      return models[key].destroy({ where: {}, force: true })
    })
  )
  done()
})

afterAll(async (done) => {
  connection.close().then(() => { done() })
})
