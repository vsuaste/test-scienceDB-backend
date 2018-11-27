'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn('dogs', 'personId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'people',
                key: 'id'
            }
        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn('dogs', 'personId');
    }

};