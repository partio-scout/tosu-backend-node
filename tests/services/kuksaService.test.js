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

test('Fetch Kuksa events by age group (TODO)', async () => {
  // TODO: How to test?
  expect(await kuksaService.getKuksaEventsByAgeGroup("")).toBe(null)
})

test('Parse Kuksa event into tosu event', async () => {
  const kuksaEvent = {
    "Id": "17732",
    "Nimi": "E-KP Akela-/sampo-koulutus - ÄLÄ ILMOITTAUDU VIELÄ",
    "Alkupvm": "2018-10-26T00:00:00",
    "Loppupvm": "2018-10-28T00:00:00",
    "Alkukellonaika": null,
    "Loppukellonaika": null,
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
  expect(parsed.endTime).toBe("00:00") // Original time is null
  expect(parsed.type).toBe("Koulutustoiminta")
  expect(parsed.information).toBe("Koulutus toteutetaan Opintokeskus Siviksen tuella<br />")
  expect(parsed.kuksaEvent).toBe(true)
  expect(parsed.kuksaEventId).toBe("17732")
  expect(parsed.activities.length).toBe(0)
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
