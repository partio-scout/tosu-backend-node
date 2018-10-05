const eventRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')


eventRouter.get('', async (req, res) => {
  const scout = req.session.scout
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
  if (!scout){ //TODO: Check here if scout is logged in
    res.status(403).send('You are not logged in!')
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
})

eventRouter.put('/:eventId', async (req, res) => {
  const scout = req.session.scout
  const eventId=req.params.eventId
  models.Event.findById(eventId).then(event => {
    if (event === null){
      res.status(404).send('The event does not exist!')
    }if (event.scoutId !== scout.id){ 
      res.status(403).send('You are not the owner of this event!')
    }else{
      event.update({
        title: req.body.title,
        startDate: req.body.startDate,
        startTime: req.body.startTime,
        endDate: req.body.endDate,
        endTime: req.body.endTime,
        type: req.body.type,
        information: req.body.information
      }).then(event => {
        res.status(200).send(event)
      })
    }
  })
})

eventRouter.delete('/:eventId', async (req, res) => {
  const scout = req.session.scout
  const eventId=req.params.eventId

  models.Event.findById(eventId).then(event => {
    console.log(event)
    if (event === null){
      res.status(404).send('The event does not exist!')
    }if (event.scoutId !== scout.id){ 
      res.status(403).send('You are not the owner of this event!')
    }else{
      console.log('destroy')
      event.destroy().then(rowsDeleted => {
        if (rowsDeleted === 1) {
          res.status(200).send('The event deleted.')
        } else {
          res.status(404).send('Not deleted - BUGI!!!')
        }
      })
    }
  })
})

module.exports = eventRouter
