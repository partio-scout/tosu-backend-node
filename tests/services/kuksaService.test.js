const models = require('../../domain/models')
const kuksaService = require('../../services/kuksaService')
require('../handleTestDatabase')

var tosuEventsWithWrongTitle
var tosuEvents
var kuksaEvents
var scout

beforeEach(async () => {
  scout = await models.Scout.create()
  const kuksaId1 = Math.floor(Math.random() * 1001)
  const kuksaId2 = Math.floor(Math.random() * 1001)

  // Already parsed by parseKuksaEvents():
  kuksaEvents = [
    { id: "kuksa" + kuksaId1, title: "kuksa eventti 1", kuksaEvent: true, kuksaEventId: kuksaId1 },
    { id: "kuksa" + kuksaId2, title: "kuksa eventti 2", kuksaEvent: true, kuksaEventId: kuksaId2 },
  ]

  tosuEventsWithWrongTitle = []
  tosuEventsWithWrongTitle.push(await models.Event.create({title:"test 1", scoutId: scout.id, kuksaEventId: kuksaId1}))
  tosuEventsWithWrongTitle.push(await models.Event.create({title:"test 2", scoutId: scout.id}))
  tosuEventsWithWrongTitle.push(await models.Event.create({title:"test 3", scoutId: scout.id}))

  tosuEvents = []
  tosuEvents.push(await models.Event.create({title:"kuksa eventti 1", scoutId: scout.id, kuksaEventId: kuksaId1}))
  tosuEvents.push(await models.Event.create({title:"test 2", scoutId: scout.id}))
  tosuEvents.push(await models.Event.create({title:"test 3", scoutId: scout.id}))

})

test('Sync title from kuksa event to tosu event, removes kuksa source event', async () => {
  const events = await kuksaService.syncEvents(kuksaEvents, scout.id)
  tosuEventsWithWrongTitle[0].dataValues.title = "kuksa eventti 1" // Expect to update "test 1" to this title from kuksa
  expect(hasEvents(events, tosuEventsWithWrongTitle, kuksaEvents)).toBe(true)
})

test('Event deleted in Kuksa is deleted in tosu as well', async () => {
  kuksaEvents.splice(0, 1) // Remove 0th element (synced event's corresponding kuksa event)
  const events = await kuksaService.syncEvents(kuksaEvents, scout.id)
  tosuEvents.splice(0, 1) // Expect the corresponding tosu event to be removed as well
  expect(hasEvents(events, tosuEvents, kuksaEvents))
})

// Checks equality by id and title, doesn't accept duplicates
function hasEvents(group, events1, events2) {
  for (var i = 0; i < events1.length; i++) {
    var found = false
    var foundDuplicate = false
    for (var j = 0; j < group.length; j++) {
      if (group[j].id === events1[i].dataValues.id && group[j].title === events1[i].dataValues.title) {
        if (found) foundDuplicate = true
        found = true
      }
    }
    if (!found || foundDuplicate) return false
  }
  for (var i = 0; i < events2.length; i++) {
    var found = false
    var foundDuplicate = false
    for (var j = 0; j < group.length; j++) {
      if (group[j].id === events2[i].id && group[j].title === events2[i].title) {
        if (found) foundDuplicate = true
        found = true
      }
    }
    if (!found || foundDuplicate) return false
  }
  return true
}
