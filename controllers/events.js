const axios = require('axios')

const eventRouter = require('express').Router()
const verifyService = require('../services/verifyService')
const eventService = require('../services/eventService')

// Get a list of scouts events
eventRouter.get('', async (req, res) => {
  const scout = req.session.scout
  const events = await eventService.getAllEvents(scout.id)
  res.status(200).json(events)
})

eventRouter.get('/tapahtumat', async (req, res) => {
  const apiEvents = await axios.get('https://demo.kehatieto.fi/partiolaiset/Tapahtumat_Rajapinta/api/Tapahtumahaku?PvmValillaAlku=2018-10-01&PvmValillaLoppu=2018-11-01')
  res.send(apiEvents)
})

// Add a new event, return the added event
eventRouter.post('', async (req, res) => {
  const scout = req.session.scout
  const event = await eventService.createEvent(scout.id, req.body)
  res.status(200).json(event)
})

// Edit an event, return the edited event
eventRouter.put('/:eventId', async (req, res) => {
  const scout = req.session.scout
  const eventId = parseInt(req.params.eventId)
  if (isNaN(eventId)) {
    return res.status(404).send('Invalid event id!')
  }
  if (!await verifyService.scoutOwnsEvent(scout, eventId)) {
    return res.status(403).send('You are not the owner of this event!')
  }
  const event = await eventService.updateEvent(eventId, req.body)
  if (event.error) { //Should never really happen since verifyService should prevent all errors
    return res.status(404).send(event.error)
  }
  res.status(200).json(event)
})

// Add a new activity to the event
eventRouter.post('/:eventId/activities', async (req, res) => {
  const scout = req.session.scout
  const eventId = parseInt(req.params.eventId)
  if (isNaN(eventId)) {
    return res.status(404).send('Invalid event id!')
  }
  if (!await verifyService.scoutOwnsEvent(scout, eventId)){
    return res.status(403).send('You are not the owner of this event!')
  }
  const activity = await eventService.addActivityToEvent(eventId, req.body)
  if (activity.error){ //Should never really happen since verifyService should prevent all errors
    return res.status(500).send(activity.error)
  }
  res.status(200).json(activity)
})


// Delete an event
eventRouter.delete('/:eventId', async (req, res) => {
  const scout = req.session.scout
  const eventId = parseInt(req.params.eventId)
  if (isNaN(eventId)) {
    return res.status(404).send('Invalid event id!')
  }
  if (!await verifyService.scoutOwnsEvent(scout, eventId)) {
    return res.status(403).send('You are not the owner of this event!')
  }
  const event = await eventService.getEvent(eventId)
  const succeeded = await eventService.deleteEvent(eventId)
  if (!succeeded) { // Should not happen
    return res.status(404).send('The event was not deleted.')
  }
  res.status(200).json(event)
})

module.exports = eventRouter
