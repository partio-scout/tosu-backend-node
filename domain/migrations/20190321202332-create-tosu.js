'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tosus', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      selected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tosus')
  },
}
