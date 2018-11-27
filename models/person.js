'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var Person = sequelize.define('person', {

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

    Person.associate = function(models) {
        Person.hasMany(models.dog, {
            foreignKey: 'personId'
        });
        Person.belongsToMany(models.book, {
            through: 'books_to_people'
        });
    };

    return Person;
};