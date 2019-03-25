const models = require('../domain/models')

// Modifies a plan
async function modifyPlan(planId, planData) {
  try {
    await models.Plan.update(planData, {
      where: {
        id: { $eq: planId },
      },
    })
    const updatedPlan = await models.Plan.findById(planId)
    return updatedPlan
  } catch (error) {
    return { error: error }
  }
}

// Deletes a plan
async function deletePlan(planId) {
  try {
    const rowsDeleted = await models.Plan.destroy({
      where: {
        id: { $eq: planId },
      },
    })
    if (rowsDeleted === 1) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return { error: error }
  }
}

module.exports = {
  modifyPlan,
  deletePlan,
}
