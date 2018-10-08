const eventgroupRouter = require('express').Router()
const models = require('../domain/models')

eventgroupRouter.post('/', async (req,res) => {
  const group = await models.EventGroup.create()
  res.json(group.id)
})

eventgroupRouter.delete('/:id', async (req,res) => {
  const groupId = req.params.id
  models.EventGroup.destroy({
    where: {
      id: { $eq: groupId }
    }
  }).then(rowsDeleted => {
    //TODO: Delete events with this grooupId
    if (rowsDeleted === 1) {
      console.log('Deleted activity with ID', req.params.id)
      res.status(204).send('Deleted')
    } else {
      console.log('No eventgroup with ID', req.params.id)
      res.status(404).send('Not deleted')
    }
  })
})

module.exports = eventgroupRouter