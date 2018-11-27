'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var Dog = sequelize.define('dog', {

        name: {
            type: Sequelize.STRING
        },
        breed: {
            type: Sequelize.STRING
        }
    });

    Dog.associate = function(models) {
        Dog.belongsTo(models.person, {
            foreignKey: 'personId'
        });
        Dog.belongsTo(models.researcher, {
            foreignKey: 'researcherId'
        });
    };

    return Dog;
};