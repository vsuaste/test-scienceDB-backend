'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('individuals', {

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
            }

        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('individuals');
    }

};