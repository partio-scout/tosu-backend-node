const axios = require('axios')
const models = require('../domain/models')

const EVENT_API = "https://demo.kehatieto.fi/partiolaiset/Tapahtumat_Rajapinta/api/Tapahtumahaku"

async function getKuksaEventsByAgeGroup(ageGroup) {
  let response = await axios.get(EVENT_API)
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
    const endDate = new Date(kuksaEvent.Loppupvm)
    const twoDigitEndDay = ("0" + endDate.getDate()).slice(-2)
    const twoDigitEndMonth = ("0" + (endDate.getMonth() + 1)).slice(-2)
    
    return {
      id: "kuksa" + kuksaEvent.Id,
      title: kuksaEvent.Nimi,
      startDate: startDate.getFullYear() + "-" + twoDigitStartMonth + "-" + twoDigitStartDay,
      endDate: endDate.getFullYear() + "-" + twoDigitEndMonth + "-" + twoDigitEndDay,
      startTime: "00:00", // TODO: use kuksaEvent.Alkukellonaika (but might be null)
      endTime: "00:00",
      type: "Kokous", // TODO: use kuksaEvent.TilaisuudenTyyppi (also add types to frontend)
      information: kuksaEvent.KuvausHTML,
      kuksaEvent: true,
      activities: [],
    }
  })
}

module.exports = {
  getKuksaEventsByAgeGroup,
}
