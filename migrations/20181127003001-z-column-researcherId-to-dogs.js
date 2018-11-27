'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn('dogs', 'researcherId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'researchers',
                key: 'id'
            }
        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn('dogs', 'researcherId');
    }

};