'use strict'

module.exports = (sequelize, DataTypes) => {
  const Scout = sequelize.define('Scout', {
    googleId: DataTypes.STRING,
    name: DataTypes.STRING
  }, {})

  Scout.associate = (models) => {
    Scout.hasMany(models.Event, { foreignKey: 'scoutId' })
    Scout.hasOne(models.ActivityBuffer, { foreignKey: 'scoutId' })
  }

  return Scout
}
