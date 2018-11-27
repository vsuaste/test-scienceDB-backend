'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('books', {

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

            title: {
                type: Sequelize.STRING
            },
            genre: {
                type: Sequelize.STRING
            },
            publisherId: {
                type: Sequelize.INTEGER
            }

        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('books');
    }

};