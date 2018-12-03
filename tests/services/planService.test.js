const models = require('../../domain/models')
const planService = require('../../services/planService')
require('../handleTestDatabase')

var scout
var plan


beforeEach(async () => {
  scout = await models.Scout.create()
  plan = await models.Plan.create({
    title: "Quaint plan",
    guid: "jgkdflhgjfkld",
    content: "Do this and that"
  })
})

test('Modify a plan', async () => {
  await planService.modifyPlan(plan.id, {title: 'asdg'})
  const dbPlan = await models.Plan.findById(plan.id)
  expect(dbPlan.title).toBe('asdg')
})


test('Delete a plan', async () => {
  await planService.deletePlan(plan.id)
  const dbPlan = await models.Plan.findById(plan.id)
  expect(dbPlan).toBe(null)
})


