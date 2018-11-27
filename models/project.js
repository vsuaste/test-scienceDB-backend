'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var Project = sequelize.define('project', {

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

    Project.associate = function(models) {
        Project.belongsToMany(models.researcher, {
            through: 'project_to_researcher'
        });
    };

    return Project;
};