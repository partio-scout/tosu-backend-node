// This migration file adds relations to the models.

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Activity belongs to Event
    return queryInterface.addColumn(
      'Activities', // Name of the table to be modified (note plural and capitalization)
      'eventId', { // Name of the column to be added (note capitalization)
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Events', // Model that the foreign key is referencing (note plural)
          key: 'id', // Column referenced in Event
        }
      }
    ).then(() => {
      // Activity belongs to ActivityBuffer
      return queryInterface.addColumn(
        'Activities',
        'activityBufferId', {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE', // When ActivityBuffer is deleted, so are its Activities
          references: {
            model: 'ActivityBuffers',
            key: 'id',
          }
        }
      )
    }).then(() => {
      // ActivityBuffer belongs to Scout
      return queryInterface.addColumn(
        'ActivityBuffers',
        'scoutId', {
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
        'eventGroupId', {
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
        'scoutId', {
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
        'activityId', {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'Activities',
            key: 'id',
          }
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    // remove added columns in reversed order
    // LOL, the order wouldn't actually even matter :Dd
    return queryInterface.removeColumn('Plans', 'activityId').then(() => {
      return queryInterface.removeColumn('Events', 'scoutId')
    }).then(() => {
      return queryInterface.removeColumn('Events', 'eventGroupId')
    }).then(() => {
      return queryInterface.removeColumn('ActivityBuffers', 'scoutId')
    }).then(() => {
      return queryInterface.removeColumn('Activities', 'activityBufferId')
    }).then(() => {
      return queryInterface.removeColumn('Activities', 'eventId')
    })
  }
}
