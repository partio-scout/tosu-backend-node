'use strict'

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
          not: ['^( |\t|\n)*$', 'i'], // Not whitespace-only
        },
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {},
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {},
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // TODO: should there be isIn validation for type?
          // if there was isIn validation, it could cause problems
          // if some kuksa event had a type that is not listed here...
          // isIn: [['leiri', 'retki']],
          not: ['^( |\t|\n)*$', 'i'], // Not whitespace-only
          len: [1, 255],
        },
      },
      information: {
        type: DataTypes.STRING(32767),
        allowNull: false,
        validate: {
          len: [0, 32767],
        },
      },
      kuksaEventId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {},
      },
    },
    {}
  )

  Event.associate = models => {
    Event.belongsTo(models.EventGroup, { foreignKey: 'eventGroupId' })
    Event.belongsTo(models.Tosu, { foreignKey: 'tosuId', allowNull: false })
    Event.hasMany(models.Activity, { foreignKey: 'eventId' })
  }

  return Event
}
