const models = require('../domain/models')
const PDFDocument = require('pdfkit')
/**
 * Get a list of Tosus belonging to the scout
 * @param scoutId - The ID of the scout
 * @returns List of Tosus
 */
const getAll = scoutId =>
  models.Tosu.findAll({
    where: {
      scoutId: scoutId,
    },
  }).catch(error => console.log(error))

/**
 * Create a new Tosu for the scout
 * @param scoutId - The ID of the scout
 * @param tosuName - Name for the new Tosu
 * @returns The created Tosu
 */
const create = (scoutId, tosuName) =>
  models.Tosu.create({
    name: tosuName,
    scoutId: scoutId,
  }).catch(error => console.log(error))

/**
 * Update the Tosu and return the new version
 * @param tosuId - The ID of the Tosu
 * @param body - Object which contains values to be replaced
 * @returns The updated Tosu
 */
const update = (tosuId, body) =>
  models.Tosu.update(body, {
    where: {
      id: tosuId,
    },
    returning: true,
  })
    .then(([rowsUpdated, [updatedTosu]]) => updatedTosu)
    .catch(error => console.log(error))

/**
 * Change the selected Tosu
 * @param tosuId - The ID of the selected Tosu
 * @param scoutId - The ID of the scout
 */
const select = (scoutId, tosuId) => {
  // Unselect the previously selected Tosu
  models.Tosu.update(
    { selected: false },
    {
      where: {
        scoutId: scoutId,
        selected: true,
      },
    }
  ).catch(error => console.log(error))
  // Select the new Tosu
  return models.Tosu.update(
    { selected: true },
    {
      where: {
        id: tosuId,
      },
      returning: true,
    }
  )
    .then(([rowsUpdated, [selectedTosu]]) => selectedTosu)
    .catch(error => console.log(error))
}

/**
 * Delete the Tosu
 * @param tosuId - The ID of the Tosu to be deleted
 */
const remove = tosuId =>
  models.Tosu.destroy({
    where: {
      id: tosuId,
    },
  }).catch(error => console.log(error))

const pdf = (tosuId, res) => {
  models.Tosu.find({where:{id:tosuId}, include: [
   {model: models.Event, include:[models.Activity]}
  ]}).then(tosu => {
    const events = tosu.dataValues.Events.map( dbevent => dbevent.dataValues)
    const doc = new PDFDocument
    doc.pipe(res)
    doc.fontSize(16)
    doc.text(`Tomintasuunnitelma: ${tosu.dataValues.name}`)
    doc.moveDown(1)
    events.forEach( e => {
      doc.fontSize(14)
      doc.text(`${e.title}`)
      doc.fontSize(10)
      doc.text(`  ${e.type}`)
      doc.text(`    ${e.startDate} - ${e.endDate}`)
      doc.text(`    ${e.startTime} - ${e.endTime}`)
      doc.moveDown(1) 
    })
    doc.end()
    return doc
  })  
}

module.exports = {
  getAll,
  create,
  update,
  select,
  remove,
  pdf,
}
