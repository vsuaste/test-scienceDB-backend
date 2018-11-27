'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('researchers', {

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

            firstName: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            }

        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('researchers');
    }

};