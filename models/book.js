'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var Book = sequelize.define('book', {

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

    Book.associate = function(models) {
        Book.belongsToMany(models.person, {
            through: 'books_to_people'
        });
    };

    return Book;
};