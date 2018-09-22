'use strict'

module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('Plan', {
    title: DataTypes.STRING,
    guid: DataTypes.STRING,
    content: DataTypes.STRING(2047)
  }, {})

  Plan.associate = (models) => {
    Plan.belongsTo(models.Activity, { foreignKey: "activityId" })
  }

  return Plan
};
