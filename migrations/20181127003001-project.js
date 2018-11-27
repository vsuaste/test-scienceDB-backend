'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('projects', {

            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            specieId: {
                type: Sequelize.INTEGER
            }

        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('projects');
    }

};