'use strict'

module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('Plan', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,255],
        not: ['^( |\t|\n)*$','i'], // Not whitespace-only
      },
    },
    guid: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,255],
        not: ['^( |\t|\n)*$','i'], // Not whitespace-only
      },
    },
    content: {
      type: DataTypes.STRING(32767),
      allowNull: false,
      validate: {
        len: [0,32767],
      },
    },
  }, {})

  Plan.associate = (models) => {
    Plan.belongsTo(models.Activity, { foreignKey: 'activityId' })
  }

  return Plan
}
