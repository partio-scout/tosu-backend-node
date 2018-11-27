'use strict'

module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    guid: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,255],
        not: ['^( |\t|\n)*$','i'], // Not whitespace-only
      },
    },
  }, {})

  Activity.associate = (models) => {
    Activity.belongsTo(models.Event, { foreignKey: "eventId" })
    Activity.hasMany(models.Plan, { foreignKey: "activityId" })
    Activity.belongsTo(models.ActivityBuffer, { foreignKey: "activityBufferId" })
  }


  Activity.findByEvent = async (event) => {
    return await Activity.findAll({
      where: {
        eventId: { $eq: event.id }
      }
    })
  }


  return Activity
}
