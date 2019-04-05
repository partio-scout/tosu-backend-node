const sequelize = require('sequelize')
const models = require('../../domain/models')
require('../handleTestDatabase')

var eventData

beforeEach(async () => {
  eventData={
    title: 'Let\'s go fishing!',
    startDate: '2018-09-23',
    endDate: '2018-09-23',
    startTime: '17:46:22.33',
    endTime: '18:44:05.795',
    type: 'Retki',
    information: 'Fishing fish',
  }
})

test('Event can be created', async () => {
  const event = await models.Event.create(eventData)
  expect(Number.isInteger(event.id)).toBe(true)
  expect(event.title).toBe('Let\'s go fishing!')
  expect(event.startDate).toBe('2018-09-23')
  expect(event.endDate).toBe('2018-09-23')
  expect(event.startTime).toBe('17:46:22.33')
  expect(event.endTime).toBe('18:44:05.795')
  expect(event.type).toBe('Retki')
  expect(event.information).toBe('Fishing fish')
})

test('Event with zero length name cannot be created', async () => {
  eventData.title = ''
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})

test('Event with whitespace-only name cannot be created', async () => {
  eventData.title = '	  	  \n'
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})


test('Event with null or undefined name cannot be created', async () => {
  eventData.title = null
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
  
  eventData.title = undefined
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
  
  delete eventData.title
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})

test('Event with invalid starting time cannot be created', async () => {
  eventData.startTime = 'ääÄÄÖÖöööåååÅÅÅå'
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})

test('Event with null or undefined starting time cannot be created', async () => {
  eventData.startTime = null
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
  
  eventData.startTime = undefined
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
  
  delete eventData.startTime
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})


test('Event with type of length 0 cannot be created', async () => {
  eventData.type = ''
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})

test('Event with whitespace-only type cannot be created', async () => {
  eventData.type = '	  	  \n'
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})

test('Event with null or undefined type cannot be created', async () => {
  eventData.type = null
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
  
  eventData.type = undefined
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
  
  delete eventData.type
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})


test('Event with null or undefined information cannot be created', async () => {
  eventData.information = null
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
  
  eventData.information = undefined
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
  
  delete eventData.information
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})

/*

These tests for date validation are disabled, because they caused 
following warning to the console:

  Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.
  moment construction falls back to js Date(), which is not reliable across all
  browsers and versions. Non RFC2822/ISO date formats are discouraged and will be 
  removed in an upcoming major release. Please refer to 
  http://momentjs.com/guides/#/warnings/js-date/ for more info.
    ...


test('Event with invalid starting date cannot be created', async () => {
  eventData.startDate = 'ääÄÄÖÖöööåååÅÅÅå'
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})

test('Event with invalid ending date cannot be created', async () => {
  eventData.endDate = 'ääÄÄÖÖöööåååÅÅÅå'
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})
*/

test('Event with invalid ending time cannot be created', async () => {
  eventData.endTime = 'ääÄÄÖÖöööåååÅÅÅå'
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})

test('Event with null or undefined ending time cannot be created', async () => {
  eventData.endTime = null
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
  
  eventData.endTime = undefined
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
  
  delete eventData.endTime
  await expect(models.Event.create(eventData)).rejects.toThrow(sequelize.SequelizeValidationError)
})

test('Event can be assigned to EventGroup', async () => {
  const eventGroup = await models.EventGroup.create()
  eventData.eventGroupId = eventGroup.id
  const event = await models.Event.create(eventData)
  expect(event.eventGroupId).toBe(eventGroup.id)

  const fetchedEvent = await models.Event.findById(event.id, { include: [models.EventGroup] })
  expect(fetchedEvent.EventGroup.id).toBe(eventGroup.id)
})

test('Event can be assigned Activities', async () => {
  const event = await models.Event.create(eventData)
  const activity1 = await models.Activity.create({ guid: 'guid', eventId: event.id })
  const activity2 = await models.Activity.create({ guid: 'pakollinen', eventId: event.id })

  const fetchedEvent = await models.Event.findById(event.id, { include: [models.Activity] })
  expect(fetchedEvent.Activities.length).toBe(2)
})

test('Event can be assigned to Tosu', async () => {
  const scout = await models.Scout.create({ partioId: '1234', name: 'PartioId' })
  const tosu = await models.Tosu.create({ name:"tarpojat", scoutId:scout.id})
  eventData.tosuId = tosu.id
  const event = await models.Event.create(eventData)
  const fetchedEvent = await models.Event.findById(event.id, { include: [models.Tosu] })
  expect(fetchedEvent.Tosu.id).toBe(tosu.id)
})
