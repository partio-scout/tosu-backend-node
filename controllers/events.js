const eventRouter = require('express').Router()
const verifyService = require('../services/verifyService')
const eventService = require('../services/eventService')

// TODO: verify if the scout is actually logged in ..?


// Get a list of scouts events
eventRouter.get('', async (req, res) => {
  const scout = req.session.scout
  if (!scout){
    res.status(403).send('you are not logged in!')
  }else{
    const events = await eventService.getAllEvents(scout.id)
    res.status(200).send(events) 
  }
})

// Add a new event, return the added event
eventRouter.post('', async (req, res) => {
  const scout = req.session.scout
  if (!scout){
    res.status(403).send('You are not logged in!')
  }else{
    const event = await eventService.createEvent(scout.id, req.body)
    res.status(200).send(event)
  }
})

// Edit an event, return the edited event
eventRouter.put('/:eventId', async (req, res) => {
  const scout = req.session.scout
  const eventId = req.params.eventId
  if (!await verifyService.scoutOwnsEvent(scout, eventId)){
    return res.status(403).send('You are not the owner of this event!')
  }

  const event = await eventService.updateEvent(eventId, req.body)
  if (event.error){ //Should never really happen since verifyService should prevent all errors
    res.status(404).send(event.error)
  }else{
    res.status(200).send(event)
  }
})

// Delete an event
eventRouter.delete('/:eventId', async (req, res) => {
  const scout = req.session.scout
  const eventId = req.params.eventId
  if (!await verifyService.scoutOwnsEvent(scout, eventId)){
    res.status(403).send('You are not the owner of this event!')
  }else{
    const event = await eventService.getEvent(eventId)
    const succeeded = await eventService.deleteEvent(eventId)
    if (succeeded) {
      res.status(200).send(event)
    }else{ //Should not happen
      res.status(404).send('The event was not deleted.')
    }
  }
})

module.exports = eventRouter
