const axios = require('axios')
const models = require('../domain/models')

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
  let response = await axios.get(getEventApi())
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
    const startTime = kuksaEvent.Alkukellonaika ? kuksaEvent.Alkukellonaika : "00:00"

    const endDate = new Date(kuksaEvent.Loppupvm)
    const twoDigitEndDay = ("0" + endDate.getDate()).slice(-2)
    const twoDigitEndMonth = ("0" + (endDate.getMonth() + 1)).slice(-2)
    const endTime = kuksaEvent.Loppukellonaika ? kuksaEvent.Loppukellonaika : "00:00"

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

module.exports = {
  getKuksaEventsByAgeGroup,
}
