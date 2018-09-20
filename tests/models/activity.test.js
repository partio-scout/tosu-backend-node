const supertest = require('supertest')
const sequelize = require('sequelize')
const models = require('../../server/models/');

test('Activity can be created', async () => {
  var activity = await models.Activity.create({guid: "ghdfjkghdfjk"})
  expect(activity.guid).toBe("ghdfjkghdfjk")
})

afterAll(() => {
  models.sequelize.close()
})
