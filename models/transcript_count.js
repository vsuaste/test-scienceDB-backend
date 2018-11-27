'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var transcript_count = sequelize.define('transcript_count', {

        gene: {
            type: Sequelize.STRING
        },
        variable: {
            type: Sequelize.STRING
        },
        count: {
            type: Sequelize.FLOAT
        },
        tissue_or_condition: {
            type: Sequelize.STRING
        }
    });

    transcript_count.associate = function(models) {
        transcript_count.belongsTo(models.individual, {
            foreignKey: 'individual_id'
        });
    };

    return transcript_count;
};