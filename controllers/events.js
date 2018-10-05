const eventRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')

//TODO...

eventRouter.get('', async (req, res) => {
  const scout = req.session.scout
  console.log(scout.id)
  if (!scout){//TODO: CHECK here if scout is logged in
    res.status(403).send('you are not logged in!')
  }else{
    models.Event.findAll({
      where:{
        scoutId: {$eq:scout.id}
      }
    }).then(events => {
      res.status(200).send(events)
    })
  }
})

eventRouter.post('', async (req, res) => {
  const scout = req.session.scout
  console.log(scout)
  if (!scout){ //TODO: Check here if scout is logged in
    res.status(403).send('you are not logged in!')
  }else{
    models.Event.create({
      title: req.body.title,
      startDate: req.body.startDate,
      startTime: req.body.startTime,
      endDate: req.body.endDate,
      endTime: req.body.endTime,
      type: req.body.type,
      information: req.body.information,
      scoutId: scout.id 
    }).then(event =>{
      res.status(200).send(event)
    })
  }
  //
})

eventRouter.put('/:eventId', async (req, res) => {
  //...
  console.log(req.body)
  const eventId=req.params.eventId
  models.Event.findById(eventId).then(event => {
    console.log(event)
    res.status(200).send(event)

  })

  //
})

eventRouter.delete('/:eventId', async (req, res) => {
  const eventId=req.params.eventId

  models.Event.destroy({
    where: {
      id: { $eq: eventId }
    }
  }).then(rowsDeleted => {
    if (rowsDeleted === 1) {
      console.log('Deleted event with ID', eventId)
      res.status(200).send('Deleted')
    } else {
      console.log('Did not delete activity with ID', eventId)
      res.status(404).send('Not deleted')
    }
  })
  //
})

module.exports = eventRouter
