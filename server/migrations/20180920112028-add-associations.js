// This migration file adds relations to the models.

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Activity belongs to Event
    return queryInterface.addColumn(
      'Activities', // Name of the table to be modified (note plural)
      'EventId', { // Name of the column to be added
        type: Sequelize.INTEGER,
        references: {
          model: 'Events', // Model that the foreign key is referencing (note plural)
          key: 'id' // Column referenced in Event
        }
      }
    ).then(() => {
      // Activity belongs to ActivityBuffer
      return queryInterface.addColumn(
        'Activities',
        'ActivityBufferId', {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE', // When Activityuffer is deleted, so are its Activities
          references: {
            model: 'ActivityBuffers',
            key: 'id'
          }
        }
      )
    }).then(() => {
      // ActivityBuffer belongs to Scout
      return queryInterface.addColumn(
        'ActivityBuffers',
        'ScoutId', {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'Scouts',
            key: 'id',
          }
        }
      )
    }).then(() => {
      // Event belongs to EventGroup
      return queryInterface.addColumn(
        'Events',
        'EventGroupId', {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'EventGroups',
            key: 'id',
          }
        }
      )
    }).then(() => {
      // Event belongs to Scout
      return queryInterface.addColumn(
        'Events',
        'ScoutId', {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'Scouts',
            key: 'id',
          }
        }
      )
    }).then(() => {
      // Plan belongs to Activity
      return queryInterface.addColumn(
        'Plans',
        'ActivityId', {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'ActivityBuffers',
            key: 'id',
          }
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    // TODO: Remove associations/relations. (not needed?)
  }
}
