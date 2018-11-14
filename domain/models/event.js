'use strict'

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    type: DataTypes.STRING,
    information: DataTypes.STRING(32767),
    kuksaEventId: DataTypes.INTEGER // ID of the corresponding Kuksa event. Null if not synced (local event).
  }, {})

  Event.associate = (models) => {
    Event.belongsTo(models.EventGroup, { foreignKey: "eventGroupId" })
    Event.hasMany(models.Activity, { foreignKey: "eventId" })
    Event.belongsTo(models.Scout, { foreignKey: "scoutId" })
  }

  return Event
}
