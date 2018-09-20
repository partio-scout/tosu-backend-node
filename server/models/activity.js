'use strict'

module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    guid: DataTypes.STRING
  }, {})

  Activity.associate = (models) => {
    Activity.belongsTo(models.Event)
    Activity.hasMany(models.Plan)
    Activity.belongsTo(models.ActivityBuffer, {
      as: 'buffer'
    })
  }

  return Activity
}
