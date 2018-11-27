'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn('transcript_counts', 'individual_id', {
            type: Sequelize.INTEGER,
            references: {
                model: 'individuals',
                key: 'id'
            }
        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn('transcript_counts', 'individual_id');
    }

};