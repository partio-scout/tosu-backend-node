'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    // Tosu belongs to Scout
    queryInterface
      .addColumn('Tosus', 'scoutId', {
        type: Sequelize.INTEGER,
        onDelte: 'CASCADE',
        references: {
          model: 'Scouts',
          key: 'id',
        },
      })
      .then(() =>
        // Event belongs to Tosu
        queryInterface.addColumn('Events', 'tosuId', {
          type: Sequelize.INTEGER,
          onDelte: 'CASCADE',
          references: {
            model: 'Tosus',
            key: 'id',
          },
        })
      )
      .then(() =>
        // Get all Scouts and create new Tosu for each
        queryInterface.sequelize
          .query('SELECT * FROM "Scouts"', {
            type: queryInterface.sequelize.QueryTypes.SELECT,
          })
          .then(scouts => {
            const newTosus = scouts.map(scout => ({
              scoutId: scout.id,
              name: 'yleinen',
              selected: true,
            }))
            queryInterface.bulkInsert('Tosus', newTosus)
          })
      )
      .then(() =>
        // Add all Events belonging to each Scout to their new Tosu
        queryInterface.sequelize
          .query('SELECT * FROM "Scouts"', {
            type: queryInterface.sequelize.QueryTypes.SELECT,
          })
          .then(scouts =>
            scouts.map(scout =>
              // Get the Events of a Scout
              queryInterface.sequelize
                .query(
                  'SELECT * FROM "Events" WHERE scoutId = :scoutId',
                  { replacements: { scoutId: scout.id } },
                  { type: queryInterface.sequelize.QueryTypes.SELECT }
                )
                .then(events =>
                  // Get Tosu of the scout
                  queryInterface.sequelize.query('SELECT * FROM "Scouts"', {
                    type: queryInterface.sequelize.QueryTypes.SELECT,
                  })
                )
            )
          )
      ),
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  },
}
