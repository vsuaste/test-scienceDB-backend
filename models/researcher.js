'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var Researcher = sequelize.define('researcher', {

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

    Researcher.associate = function(models) {
        Researcher.hasOne(models.dog, {
            foreignKey: 'researcherId'
        });
        Researcher.belongsToMany(models.project, {
            through: 'project_to_researcher'
        });
    };

    return Researcher;
};