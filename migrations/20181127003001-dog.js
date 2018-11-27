'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('dogs', {

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
            breed: {
                type: Sequelize.STRING
            }

        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('dogs');
    }

};