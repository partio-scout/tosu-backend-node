'use strict'

module.exports = (sequelize, DataTypes) => {
  const EventGroup = sequelize.define('EventGroup', {

  }, {})

  EventGroup.associate = (models) => {
    EventGroup.hasMany(models.Event)
  }

  return EventGroup
}