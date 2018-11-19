const axios = require('axios')
const models = require('../domain/models')
const eventService = require('./eventService')

// const EVENT_API_BASE_PRODUCTION = "https://kuksa.partio.fi" // TODO: Enable, or new ENV=staging?
const EVENT_API_BASE_PRODUCTION = "https://demo.kehatieto.fi/partiolaiset"
const EVENT_API_BASE_STAGING = "https://demo.kehatieto.fi/partiolaiset"

const EVENT_API = "/Tapahtumat_Rajapinta/api/Tapahtumahaku"

function getEventApi() {
  if (process.env.NODE_ENV === 'production') {
    return EVENT_API_BASE_PRODUCTION + EVENT_API
  } else if (process.env.NODE_ENV === 'development') {
    return EVENT_API_BASE_STAGING + EVENT_API
  } else {
    return ""
  }
}

async function getKuksaEventsByAgeGroup(ageGroup) {
  let response
  try {
    response = await axios.get(getEventApi())
  } catch (e) {
    console.log("Failed to fetch Kuksa events:",e)
    return null
  }
  let kuksaEvents = response.data.filter(kuksaEvent =>
    kuksaEvent.Ikakaudet && kuksaEvent.Ikakaudet.includes(ageGroup)
  )
  return parseKuksaEvents(kuksaEvents)
}

function parseKuksaEvents(kuksaEvents) {
  return kuksaEvents.map(kuksaEvent => {
    const startDate = new Date(kuksaEvent.Alkupvm)
    const twoDigitStartMonth = ("0" + (startDate.getMonth() + 1)).slice(-2)
    const twoDigitStartDay = ("0" + startDate.getDate()).slice(-2)
    const startTime = kuksaEvent.Alkukellonaika ? kuksaEvent.Alkukellonaika : "00:00" // TODO: Validate/parse

    const endDate = new Date(kuksaEvent.Loppupvm)
    const twoDigitEndDay = ("0" + endDate.getDate()).slice(-2)
    const twoDigitEndMonth = ("0" + (endDate.getMonth() + 1)).slice(-2)
    const endTime = kuksaEvent.Loppukellonaika ? kuksaEvent.Loppukellonaika : "00:00" // TODO: Validate/parse

    return {
      id: "kuksa" + kuksaEvent.Id,
      title: kuksaEvent.Nimi,
      startDate: startDate.getFullYear() + "-" + twoDigitStartMonth + "-" + twoDigitStartDay,
      endDate: endDate.getFullYear() + "-" + twoDigitEndMonth + "-" + twoDigitEndDay,
      startTime: startTime,
      endTime: endTime,
      type: kuksaEvent.TilaisuudenTyyppi,
      information: kuksaEvent.KuvausHTML,
      kuksaEvent: true,
      kuksaEventId: kuksaEvent.Id,
      activities: [],
    }
  })
}

/*
  Syncs events from the tosu database with events from Kuksa.
  The flow of sync happens: Kuksa -> tosu
  All information from kuksaEvents are updated to corresponding synced tosuEvents.
  Also checks for:
  - Event deleted from Kuksa -> delete from tosu (synced tosuEvent does not correspond to any kuksaEvent)
  Params:
  - kuksaEvents: Assumed to be parsed already by getKuksaEventsByAgeGroup()
*/
async function syncEvents(kuksaEvents, scoutId) {
  const syncedEvents = await models.Event.findAll({
    where: {
      kuksaEventId: { $ne: null }
    }
  })
  for (var i = 0; i < syncedEvents.length; i++) {
    // For each synced event, update values from kuksaEvent, or delete if kuksaEvent not found.
    const tosuEvent = syncedEvents[i]
    const correspondingKuksaEvent = findKuksaEvent(tosuEvent.kuksaEventId, kuksaEvents)
    if (correspondingKuksaEvent) {
      // Update
      await updateEvent(tosuEvent, correspondingKuksaEvent)
      // Delete kuksa event from kuksaEvents to avoid passing duplicates to frontend
      deleteFromArray(correspondingKuksaEvent, kuksaEvents)
    } else {
      // No Kuksa event found: Deleted from Kuksa, delete from tosu as well.
      await eventService.deleteEvent(tosuEvent.id)
    }
  }

  const tosuEvents = await eventService.getAllEvents(scoutId)
  return kuksaEvents ? tosuEvents.concat(kuksaEvents) : tosuEvents // Don't concat a null object
}

async function updateEvent(tosuEvent, kuksaEvent) {
  // Update by using database event's id as kuksaEvent's id.
  await eventService.updateEvent(tosuEvent.id, {
    title: kuksaEvent.title,
    startDate: kuksaEvent.startDate,
    endDate: kuksaEvent.endDate,
    startTime: kuksaEvent.startTime,
    endTime: kuksaEvent.endTime,
    type: kuksaEvent.type,
    information: kuksaEvent.information,
    kuksaEventId: kuksaEvent.kuksaEventId
  })
}

function deleteFromArray(obj, array) {
  var index = array.indexOf(obj)
  if (index > -1) {
    array.splice(index, 1)
  }
}

function findKuksaEvent(kuksaEventId, kuksaEvents) {
  if (!kuksaEvents) return null
  // Does not scale well... although is only executed for every synced event
  for (var i = 0; i < kuksaEvents.length; i++) {
    if (parseInt(kuksaEvents[i].kuksaEventId) === kuksaEventId) {
      return kuksaEvents[i]
    }
  }
  return null
}

module.exports = {
  getKuksaEventsByAgeGroup,
  syncEvents,
  parseKuksaEvents, // Exported for testing
}
