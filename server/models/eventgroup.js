'use strict'

module.exports = (sequelize, DataTypes) => {
  const EventGroup = sequelize.define('EventGroup', {
    temp: DataTypes.STRING
  }, {})

  EventGroup.associate = (models) => {
    EventGroup.hasMany(models.Event)
  }

  return EventGroup
}
