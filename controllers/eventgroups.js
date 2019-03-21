const eventgroupRouter = require('express').Router()
const eventgroupService = require('../services/eventgroupService')

eventgroupRouter.post('/', async (req, res) => {
  const eventGroup = await eventgroupService.createEventGroup()
  res.status(201).json(eventGroup)
})

eventgroupRouter.delete('/:id', async (req, res) => {
  const eventGroupId = parseInt(req.params.id)
  if (isNaN(eventGroupId)) {
    return res.status(404).send('Invalid event group id!')
  }
  const succeeded = await eventgroupService.deleteEventGroup(eventGroupId)
  if (!succeeded) {
    // Should not happen
    return res.status(404).send('The event group was not deleted.')
  }
  res.status(204).send()
})

module.exports = eventgroupRouter
