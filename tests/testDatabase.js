/**
  Handles the testing database. Require in all tests using the database.
  (Clears db before each test) and closes the connection afterwards.
*/

const connection = require('../domain/models').sequelize; // Needs to be closed after running tests

// Doesn't work
// beforeAll(async (done) => {
//   await connection.sync({force: true})
//   done()
// })

afterAll(async (done) => {
  connection.close().then(() => { done() })
})
