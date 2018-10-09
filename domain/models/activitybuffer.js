'use strict'

module.exports = (sequelize, DataTypes) => {
  const ActivityBuffer = sequelize.define('ActivityBuffer', {}, {})

  ActivityBuffer.associate = (models) => {
    ActivityBuffer.hasMany(models.Activity, { foreignKey: "activityBufferId" })
    ActivityBuffer.belongsTo(models.Scout, { foreignKey: "scoutId" })
  }

  // Define a class method
  // Usage: await models.ActivityBuffer.findByScout(scout)
  ActivityBuffer.findByScout = async (scout) => {
    return await ActivityBuffer.findOne({
      where: {
        scoutId: { $eq: scout.id }
      }
    })
  }

  return ActivityBuffer
}
