const eventRouter = require('express').Router()
const request = require('request')
const axios = require('axios')

const models = require('../domain/models')

//TODO...

eventRouter.get('', async (req, res) => {
  const scout = req.session.scout // ...

  console.log("YES")
  res.status(200).send('OK')
})

eventRouter.post('', async (req, res) => {
  console.log(req.body)
  models.Event.create({
    title: req.body.title,
    startDate: req.body.startDate,
    startTime: req.body.startTime,
    endDate: req.body.endDate,
    endTime: req.body.endTime,
    type: req.body.type,
    information: req.body.information
  }).then(event =>{
    res.status(200).send(event)
  })
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
      id: { [Op.eq]: eventId }
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
