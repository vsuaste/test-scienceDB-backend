'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var individual = sequelize.define('individual', {

        name: {
            type: Sequelize.STRING
        }
    });

    individual.associate = function(models) {
        individual.hasMany(models.transcript_count, {
            foreignKey: 'individual_id'
        });
    };

    return individual;
};