 'use strict'

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,255],
        not: ['^ *$','i'], // Not whitespace-only
      },
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
      },
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
      },
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
      },
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['leiri', 'baari']],
        not: ['^ *$','i'], // Not whitespace-only
        len: [1,255],
      }
    },
    information: {
      type: DataTypes.STRING(2047),
      allowNull: false,
      validate: {
        len: [0,2047],
      }
    },
  }, {})

  Event.associate = (models) => {
    Event.belongsTo(models.EventGroup, { foreignKey: "eventGroupId" })
    Event.hasMany(models.Activity, { foreignKey: "eventId" })
    Event.belongsTo(models.Scout, { foreignKey: "scoutId" })
  }

  return Event
}
