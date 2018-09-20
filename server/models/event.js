'use strict'

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    type: DataTypes.STRING,
    information: DataTypes.STRING(2047)
  }, {})

  Event.associate = (models) => {
    Event.belongsTo(models.EventGroup)
    Event.hasMany(models.Activity)
    Event.belongsTo(models.Scout)
  }

  return Event
}
