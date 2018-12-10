'use strict'

module.exports = (sequelize, DataTypes) => {
  const Scout = sequelize.define('Scout', {
    googleId:  {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1,255],
        not: ['^( |\t|\n)*$','i'], // Not whitespace-only
      },
    },
    partioId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1,255],
        not: ['^( |\t|\n)*$','i'], // Not whitespace-only
      },
    }, // Scout will have either googleId or partioId
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,255],
        not: ['^( |\t|\n)*$','i'], // Not whitespace-only
      },
    },
  },  {
    validate: {
      eitherGoogleOrPartio() {
        if ((this.googleId === null && this.partioId === null)) {
          throw new Error('Require either googleId or partioId')
        }
      }
    } 
  })

  Scout.associate = (models) => {
    Scout.hasMany(models.Event, { foreignKey: 'scoutId' })
    Scout.hasOne(models.ActivityBuffer, { foreignKey: 'scoutId' })
  }

  return Scout
}
