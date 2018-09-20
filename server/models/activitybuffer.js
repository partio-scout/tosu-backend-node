'use strict'

module.exports = (sequelize, DataTypes) => {
  const ActivityBuffer = sequelize.define('ActivityBuffer', {

  }, {})

  ActivityBuffer.associate = (models) => {
    ActivityBuffer.hasMany(models.Activity)
    ActivityBuffer.belongsTo(models.Scout)
  }

  return ActivityBuffer
}
