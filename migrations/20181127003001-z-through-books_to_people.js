'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('books_to_people', {

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            personId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'people',
                    key: 'id'
                }
            },

            bookId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'books',
                    key: 'id'
                }
            }
        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('books_to_people');
    }

};