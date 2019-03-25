'use strict'

module.exports = (sequelize, DataTypes) => {
  const ActivityBuffer = sequelize.define('ActivityBuffer', {}, {})

  ActivityBuffer.associate = models => {
    ActivityBuffer.belongsTo(models.Scout, { foreignKey: 'scoutId' })
    ActivityBuffer.hasMany(models.Activity, { foreignKey: 'activityBufferId' })
  }

  // Define a class method
  // Usage: await models.ActivityBuffer.findByScout(scout)
  ActivityBuffer.findByScout = async scout => {
    return await ActivityBuffer.findOne({
      where: {
        scoutId: { $eq: scout.id },
      },
    })
  }

  return ActivityBuffer
}
