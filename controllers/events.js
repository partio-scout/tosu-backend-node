const eventRouter = require('express').Router()
const verifyService = require('../services/verifyService')
const eventService = require('../services/eventService')


eventRouter.get('', async (req, res) => {
  const scout = req.session.scout
  if (!scout){//TODO: CHECK here if the scout is actually logged in
    res.status(403).send('you are not logged in!')
  }else{ //TODO: does eventService.getAllEvents always succeed - handle exceptions
    const events = await eventService.getAllEvents(scout.id)
    res.status(200).send(events) 
  }
})

eventRouter.post('', async (req, res) => {
  const scout = req.session.scout
  if (!scout){ //TODO: Check here if scout is actually logged in
    res.status(403).send('You are not logged in!')
  }else{ //TODO: does eventService.createEvent always succeed?
    const event = await eventService.createEvent(scout.id, req.body)
    res.status(200).send(event)
  }
})

eventRouter.put('/:eventId', async (req, res) => {
  const scout = req.session.scout
  const eventId=req.params.eventId
  if (!verifyService.scoutOwnsEvent(scout, eventId)){ //TODO: Check here if scout is actually logged in
    res.status(403).send('You are not the owner of this event!')
  }else{ //TODO: does eventService.updateEvent always succeed?
    const event=await eventService.updateEvent(eventId, req.body)
    res.status(200).send(event)
  }
})

eventRouter.delete('/:eventId', async (req, res) => {
  const scout = req.session.scout
  const eventId=req.params.eventId
  if (!verifyService.scoutOwnsEvent(scout, eventId)){ //TODO: Check here if scout is actually logged in
    res.status(403).send('You are not the owner of this event!')
  }else{
    const succeeded=await eventService.deleteEvent(eventId)
    if (succeeded) {
      res.status(200).send('The event deleted.')
    }else{
      res.status(404).send('The event not deleted BUGI !!!111')
    }
  }
})

module.exports = eventRouter
