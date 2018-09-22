'use strict'

module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    guid: DataTypes.STRING
  }, {})

  Activity.associate = (models) => {
    Activity.belongsTo(models.Event, { foreignKey: "eventId" })
    Activity.hasMany(models.Plan, { foreignKey: "activityId" })
    Activity.belongsTo(models.ActivityBuffer, { foreignKey: "activityBufferId" })
  }

  return Activity
}
