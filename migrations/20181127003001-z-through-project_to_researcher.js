'use strict';

module.exports = {

    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('project_to_researcher', {

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            researcherId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'researchers',
                    key: 'id'
                }
            },

            projectId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'projects',
                    key: 'id'
                }
            }
        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('project_to_researcher');
    }

};