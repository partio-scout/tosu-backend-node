const planRouter = require('express').Router()
const verifyService = require('../services/verifyService')
const planService = require('../services/planService')


// Modify a plan
planRouter.put('/:planId', async (req, res) => {
  const scout = req.session.scout
  const planId = parseInt(req.params.planId)
  if (isNaN(planId)){
    return res.status(404).send('Invalid plan id!')
  }
  if (!await verifyService.scoutOwnsPlan(scout, planId)){
    return res.status(403).send('You do not own this plan!')
  }
  const plan = await planService.modifyPlan(planId, req.body)
  res.status(200).send(plan)
})

//  Delete a plan
planRouter.delete('/:planId', async (req, res) => {
  const scout = req.session.scout
  const planId = parseInt(req.params.planId)
  if (isNaN(planId)){
    return res.status(404).send('Invalid plan id!')
  }
  if (!await verifyService.scoutOwnsPlan(scout, planId)){
    return res.status(403).send('You do not own this plan!')
  }
  const plan = await planService.deletePlan(planId)
  res.status(200).send(plan)
})


module.exports = planRouter