'use strict'

module.exports = (sequelize, DataTypes) => {
  const Tosu = sequelize.define(
    'Tosu',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 255],
          not: ['^( |\t|\n)*$', 'i'], // Not whitespace-only
        },
      },
      selected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {}
  )

  Tosu.associate = models => {
    Tosu.hasMany(models.Event, { foreignKey: 'tosuId' })
    Tosu.hasMany(models.EventGroup, { foreignKey: 'tosuId' })
    Tosu.belongsTo(models.Scout, { foreignKey: 'scoutId' })
  }

  return Tosu
}
