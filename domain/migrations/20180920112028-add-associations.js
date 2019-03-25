// This migration file adds relations to the models.

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Activity belongs to Event
    return queryInterface
      .addColumn(
        'Activities', // Name of the table to be modified (note plural and capitalization)
        'eventId', // Name of the column to be added (note capitalization)
        {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'Events', // Model that the foreign key is referencing (note plural)
            key: 'id', // Column referenced in Event
          },
        },
        {
          logging: console.log,
        }
      )
      .then(() => {
        // ActivityBuffer belongs to Scout
        return queryInterface.addColumn(
          'ActivityBuffers',
          'scoutId',
          {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
              model: 'Scouts',
              key: 'id',
            },
          },
          {
            logging: console.log,
          }
        )
      })
      .then(() => {
        // Tosu belongs to Scout
        return queryInterface.addColumn(
          'Tosus',
          'scoutId',
          {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
              model: 'Scouts',
              key: 'id',
            },
          },
          {
            logging: console.log,
          }
        )
      })
      .then(() => {
        // Activity belongs to ActivityBuffer
        return queryInterface.addColumn(
          'Activities',
          'activityBufferId',
          {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE', // When ActivityBuffer is deleted, so are its Activities
            references: {
              model: 'ActivityBuffers',
              key: 'id',
            },
          },
          {
            logging: console.log,
          }
        )
      })
      .then(() => {
        // Event belongs to EventGroup
        return queryInterface.addColumn(
          'Events',
          'eventGroupId',
          {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
              model: 'EventGroups',
              key: 'id',
            },
          },
          {
            logging: console.log,
          }
        )
      })
      .then(() => {
        // Plan belongs to Activity
        return queryInterface.addColumn(
          'Plans',
          'activityId',
          {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
              model: 'Activities',
              key: 'id',
            },
          },
          {
            logging: console.log,
          }
        )
      })
      .then(() => {
        // Event belongs to Tosu
        return queryInterface.addColumn(
          'Events',
          'tosuId',
          {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
              model: 'Tosus',
              key: 'id',
            },
          },
          {
            logging: console.log,
          }
        )
      })
      .then(() => {
        // EventGroup belongs to Tosu
        return queryInterface.addColumn(
          'EventGroups',
          'tosuId',
          {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {
              model: 'Tosus',
              key: 'id',
            },
          },
          {
            logging: console.log,
          }
        )
      })
  },

  down: (queryInterface, Sequelize) => {
    // remove added columns
    return queryInterface
      .removeColumn('Plans', 'activityId')
      .then(() => {
        return queryInterface.removeColumn('Tosus', 'scoutId')
      })
      .then(() => {
        return queryInterface.removeColumn('Events', 'tosuId')
      })
      .then(() => {
        return queryInterface.removeColumn('Events', 'eventGroupId')
      })
      .then(() => {
        return queryInterface.removeColumn('EventGroups', 'tosuId')
      })
      .then(() => {
        return queryInterface.removeColumn('ActivityBuffers', 'scoutId')
      })
      .then(() => {
        return queryInterface.removeColumn('Activities', 'activityBufferId')
      })
      .then(() => {
        return queryInterface.removeColumn('Activities', 'eventId')
      })
  },
}
