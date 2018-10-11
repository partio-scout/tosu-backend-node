const models = require('../domain/models')


// Modifies a plan
async function modifyPlan(planId, planData) {
  await models.Plan.update(
    planData,
    {
      where: {
        id: { $eq: planId }
      }
    }
  )
  const updatedPlan = await models.Plan.findById(planId)
  return updatedPlan
}


// Deletes an event
async function deletePlan(planId) {
  const rowsDeleted = await models.Plan.destroy({
    where: {
      id: { $eq: planId }
    }
  })
  if (rowsDeleted === 1) {
    return true
  } else {
    return false
  }
}


module.exports = {
  modifyPlan,
  deletePlan
}
