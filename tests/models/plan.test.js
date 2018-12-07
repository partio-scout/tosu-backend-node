const supertest = require('supertest')
const sequelize = require('sequelize')
const models = require('../../domain/models')
require('../handleTestDatabase')

test('Plan can be created', async () => {
  const plan = await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that'
  })
  expect(Number.isInteger(plan.id)).toBe(true)
  expect(plan.title).toBe('Quaint plan')
  expect(plan.guid).toBe('jgkdflhgjfkld')
  expect(plan.content).toBe('Do this and that')
})

test('Plan can be assigned to Activity', async () => {
  const activity = await models.Activity.create({guid: 'luo'})
  const plan = await models.Plan.create({
    title: 'Quaint plan',
    guid: 'jgkdflhgjfkld',
    content: 'Do this and that',
    activityId: activity.id
  })

  const fetchedPlan = await models.Plan.findById(plan.id, { include: [models.Activity] })
  expect(fetchedPlan.Activity.id).toBe(activity.id)
})
