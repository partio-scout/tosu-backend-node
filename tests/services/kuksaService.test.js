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

  // needed pass event creation validations
  const eventData = {
    startDate: '2500-10-10',
    endDate: '2501-10-10',
    startTime: '00:00',
    endTime: '00:00',
    type: 'eventti',
    information: ''
  }

  // Already parsed by parseKuksaEvents():
  kuksaEvents = [
    {...eventData, id: "kuksa" + kuksaId1, title: "kuksa eventti 1", kuksaEvent: true, kuksaEventId: kuksaId1 },
    {...eventData, id: "kuksa" + kuksaId2, title: "kuksa eventti 2", kuksaEvent: true, kuksaEventId: kuksaId2 },
  ]

  tosuEventsWithWrongTitle = []
  tosuEventsWithWrongTitle.push(await models.Event.create({...eventData, title:'test 1', kuksaEventId: kuksaId1, scoutId: scout.id}))
  tosuEventsWithWrongTitle.push(await models.Event.create({...eventData, title:'test 2', scoutId: scout.id}))
  tosuEventsWithWrongTitle.push(await models.Event.create({...eventData, title:'test 3', scoutId: scout.id}))

  tosuEvents = []
  tosuEvents.push(await models.Event.create({...eventData, title:'kuksa eventti 1', kuksaEventId: kuksaId1, scoutId: scout.id}))
  tosuEvents.push(await models.Event.create({...eventData, title:'test 2', scoutId: scout.id}))
  tosuEvents.push(await models.Event.create({...eventData, title:'test 3', scoutId: scout.id}))
})

test('Sync title from kuksa event to tosu event, removes kuksa source event', async () => {
  const events = await kuksaService.syncEvents(kuksaEvents, scout.id)
  tosuEventsWithWrongTitle[0].dataValues.title = "kuksa eventti 1" // Expect to update "test 1" to this title from kuksa
  kuksaEvents.splice(0, 1) // Remove 0th element (synced event's corresponding kuksa event, no duplicates allowed)
  expect(hasEvents(events, tosuEventsWithWrongTitle, kuksaEvents)).toBe(true)
})

test('Synced events of one scout do not affect synced events of other scouts', async () => {
  const kuksaEventsCopy = kuksaEvents.slice()
  const events = await kuksaService.syncEvents(kuksaEvents, scout.id)
  const scout2 = await models.Scout.create()
  const events2 = await kuksaService.syncEvents(kuksaEventsCopy, scout2.id)
  expect(events2.length).toBe(2) // Should be same as kuksaEvents
  expect(hasEvents(events2, [], kuksaEventsCopy)) // events2 should have all kuksa events (no tosu events)
})

test('Event deleted in Kuksa is deleted in tosu as well', async () => {
  kuksaEvents.splice(0, 1) // Remove 0th element (synced event's corresponding kuksa event)
  const events = await kuksaService.syncEvents(kuksaEvents, scout.id)
  // Expect the corresponding tosu event to be removed as well (cheked by hasEvents())
  expect(hasEvents(events, tosuEvents, kuksaEvents)).toBe(true)
})

test('TODO: Fetch Kuksa events by age group', async () => {
  // TODO: How to test? Maybe add getKuksaEventsByAgeGroup(ageGroup, mockApiResponse), use mock instead of axios
  expect(await kuksaService.getKuksaEventsByAgeGroup("")).toBe(null)
})

test('Parse Kuksa event into tosu event', async () => {
  const kuksaEvent = {
    "Id": "17732",
    "Nimi": "E-KP Akela-/sampo-koulutus - ÄLÄ ILMOITTAUDU VIELÄ",
    "Alkupvm": "2018-10-26T00:00:00",
    "Loppupvm": "2018-10-28T00:00:00",
    "Alkukellonaika": null,
    "Loppukellonaika": "21:00",
    "Paikka": null,
    "KuvausHTML": "Koulutus toteutetaan Opintokeskus Siviksen tuella<br />",
    "IlmoittautuminenPaattyy": "2018-10-01T00:00:00",
    "IlmoittautuminenPaattynyt": true,
    "JalkiIlmoittautuminenVoimassa": false,
    "TilaisuudenTyyppi": "Koulutustoiminta",
    "Jasenmaksupakko": true,
    "VainJarjestajaorganisaationjasenille": false,
    "Ikakaudet": [
        "Aikuiset",
        "Vaeltajat (18-22 v)"
    ],
    "Liitetiedostot": null,
    "Jarjestajat": [
        "Etelä-Karjalan Partiolaiset ry"
    ],
    "Ilmoittautumislinkki": "https://demo.kehatieto.fi/partiolaiset/kotisivut/login.aspx?Id=17732",
    "Ilmoittautuneita": 0
  }
  const parsed = kuksaService.parseKuksaEvents([kuksaEvent])[0]
  expect(parsed.id).toBe("kuksa17732")
  expect(parsed.title).toBe("E-KP Akela-/sampo-koulutus - ÄLÄ ILMOITTAUDU VIELÄ")
  expect(parsed.startDate).toBe("2018-10-26")
  expect(parsed.endDate).toBe("2018-10-28")
  expect(parsed.startTime).toBe("00:00") // Original time is null
  expect(parsed.endTime).toBe("21:00")
  expect(parsed.type).toBe("Koulutustoiminta")
  expect(parsed.information).toBe("Koulutus toteutetaan Opintokeskus Siviksen tuella<br />")
  expect(parsed.kuksaEvent).toBe(true)
  expect(parsed.kuksaEventId).toBe("17732")
  expect(parsed.activities.length).toBe(0)
})

test('Parse Kuksa event start and end times correctly', async () => {
  const kuksaEvent = {
    "Id": "17732",
    "Nimi": "E-KP Akela-/sampo-koulutus - ÄLÄ ILMOITTAUDU VIELÄ",
    "Alkupvm": "2018-10-26T00:00:00",
    "Loppupvm": "2018-10-28T00:00:00",
    "Alkukellonaika": "21.00",
    "Loppukellonaika": "25:00",
    "Paikka": null,
    "KuvausHTML": "Koulutus toteutetaan Opintokeskus Siviksen tuella<br />",
    "IlmoittautuminenPaattyy": "2018-10-01T00:00:00",
    "IlmoittautuminenPaattynyt": true,
    "JalkiIlmoittautuminenVoimassa": false,
    "TilaisuudenTyyppi": "Koulutustoiminta",
    "Jasenmaksupakko": true,
    "VainJarjestajaorganisaationjasenille": false,
    "Ikakaudet": [
        "Aikuiset",
        "Vaeltajat (18-22 v)"
    ],
    "Liitetiedostot": null,
    "Jarjestajat": [
        "Etelä-Karjalan Partiolaiset ry"
    ],
    "Ilmoittautumislinkki": "https://demo.kehatieto.fi/partiolaiset/kotisivut/login.aspx?Id=17732",
    "Ilmoittautuneita": 0
  }
  const parsed = kuksaService.parseKuksaEvents([kuksaEvent])[0]
  expect(parsed.id).toBe("kuksa17732")
  expect(parsed.title).toBe("E-KP Akela-/sampo-koulutus - ÄLÄ ILMOITTAUDU VIELÄ")
  expect(parsed.startDate).toBe("2018-10-26")
  expect(parsed.endDate).toBe("2018-10-28")
  expect(parsed.startTime).toBe("00:00") // Original time is invalid
  expect(parsed.endTime).toBe("00:00") // Original time is invalid
  expect(parsed.type).toBe("Koulutustoiminta")
  expect(parsed.information).toBe("Koulutus toteutetaan Opintokeskus Siviksen tuella<br />")
  expect(parsed.kuksaEvent).toBe(true)
  expect(parsed.kuksaEventId).toBe("17732")
  expect(parsed.activities.length).toBe(0)
})

// Checks equality by id and title, doesn't accept duplicates
// group: synced events returned (contains tosuEvents(+synced) and kuksaEvents)
// events1: events from the database
// events2: events from Kuksa API (parsed)
function hasEvents(group, events1, events2) {
  // Check that events1 events are in group
  for (var i = 0; i < events1.length; i++) {
    var foundInGroup = false
    var foundDuplicate = false
    for (var j = 0; j < group.length; j++) {
      if (group[j].id === events1[i].dataValues.id && group[j].title === events1[i].dataValues.title) {
        if (foundInGroup) foundDuplicate = true
        foundInGroup = true
      }
    }

    if (events1[i].dataValues.kuksaEventId) {
      // Check that if a synced event in tosuEvents (events1) does not have a corresponding event
      // in kuksaEvents (events2), then it should not be in group either.
      // Simulates deleting an event from Kuksa -> should be deleted from tosu as well.
      var foundInEvents2 = false
      for (var j = 0; j < events2.length; j++) {
        if (events1[i].dataValues.id === events2[j].id && events1[i].dataValues.title === events2[j].title) foundInEvents2 = true
        if (!foundInEvents2) {
          // Is a synced event, but no correspond kuksaEvent -> should not be in group
          if (foundInGroup || foundDuplicate) return false
        }
      }
    } else if (!foundInGroup || foundDuplicate) return false
  }

  // Check that events2 are in group
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
