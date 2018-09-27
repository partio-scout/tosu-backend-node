'use strict'

module.exports = (sequelize, DataTypes) => {
  const ActivityBuffer = sequelize.define('ActivityBuffer', {}, {})

  ActivityBuffer.associate = (models) => {
    ActivityBuffer.hasMany(models.Activity, { foreignKey: "activityBufferId" })
    ActivityBuffer.belongsTo(models.Scout, { foreignKey: "scoutId" })
  }

  return ActivityBuffer
}
