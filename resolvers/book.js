/*
    Resolvers for basic CRUD operations
*/

const book = require('../models/index').book;
const searchArg = require('../utils/search-argument');
const fileTools = require('../utils/file-tools');
const helper = require('../utils/helper');
const globals = require('../config/globals');
const checkAuthorization = require('../utils/check-authorization');
const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuidv4')
const publisher = require('./publisher');


book.prototype.peopleFilter = function({
    search,
    order,
    pagination
}, context) {

    let options = {};

    if (search !== undefined) {
        let arg = new searchArg(search);
        let arg_sequelize = arg.toSequelize();
        options['where'] = arg_sequelize;
    }

    return this.countPeople(options).then(items => {
        if (order !== undefined) {
            options['order'] = order.map((orderItem) => {
                return [orderItem.field, orderItem.order];
            });
        }

        if (pagination !== undefined) {
            options['offset'] = pagination.offset === undefined ? 0 : pagination.offset;
            options['limit'] = pagination.limit === undefined ? (items - options['offset']) : pagination.limit;
        } else {
            options['offset'] = 0;
            options['limit'] = items;
        }

        if (globals.LIMIT_RECORDS < options['limit']) {
            throw new Error(`Request of total peopleFilter exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
        }
        return this.getPeople(options);
    }).catch(error => {
        console.log("Catched the error in peopleFilter ", error);
        return error;
    });
}

book.prototype.countFilteredPeople = function({
    search
}, context) {

    let options = {};

    if (search !== undefined) {
        let arg = new searchArg(search);
        let arg_sequelize = arg.toSequelize();
        options['where'] = arg_sequelize;
    }

    return this.countPeople(options);
}

book.prototype.publisher = function(_, context) {
    return publisher.readOnePublisher({
        "id": this.publisherId
    }, context);
}



module.exports = {

    books: function({
        search,
        order,
        pagination
    }, context) {
        if (checkAuthorization(context, 'books', 'read') == true) {
            let options = {};
            if (search !== undefined) {
                let arg = new searchArg(search);
                let arg_sequelize = arg.toSequelize();
                options['where'] = arg_sequelize;
            }

            return book.count(options).then(items => {
                if (order !== undefined) {
                    options['order'] = order.map((orderItem) => {
                        return [orderItem.field, orderItem.order];
                    });
                }

                if (pagination !== undefined) {
                    options['offset'] = pagination.offset === undefined ? 0 : pagination.offset;
                    options['limit'] = pagination.limit === undefined ? (items - options['offset']) : pagination.limit;
                } else {
                    options['offset'] = 0;
                    options['limit'] = items;
                }

                if (globals.LIMIT_RECORDS < options['limit']) {
                    throw new Error(`Request of total books exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                }
                return book.findAll(options);
            }).catch(error => {
                console.log("Catched the error in books ", error);
                return error;
            });
        } else {
            return new Error("You don't have authorization to perform this action");
        }
    },

    readOneBook: function({
        id
    }, context) {
        if (checkAuthorization(context, 'books', 'read') == true) {
            return book.findOne({
                where: {
                    id: id
                }
            });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    addBook: function(input, context) {
        if (checkAuthorization(context, 'books', 'create') == true) {
            return book.create(input)
                .then(book => {
                    if (input.people) {
                        book.setPeople(input.people);
                    }
                    return book;
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    bulkAddBookXlsx: function(_, context) {
        let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
        return book.bulkCreate(xlsxObjs, {
            validate: true
        });
    },

    bulkAddBookCsv: function(_, context) {
        delim = context.request.body.delim;
        cols = context.request.body.cols;
        tmpFile = path.join(__dirname, uuidv4() + '.csv')
        return context.request.files.csv_file.mv(tmpFile).then(() => {
            return fileTools.parseCsvStream(tmpFile, book, delim, cols)
        }).catch((err) => {
            return new Error(err);
        }).then(() => {
            fs.unlinkSync(tmpFile)
        })
    },

    deleteBook: function({
        id
    }, context) {
        if (checkAuthorization(context, 'books', 'delete') == true) {
            return book.findById(id)
                .then(book => {
                    return book.destroy()
                        .then(() => {
                            return 'Item succesfully deleted';
                        });
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    updateBook: function(input, context) {
        if (checkAuthorization(context, 'books', 'update') == true) {
            return book.findById(input.id)
                .then(book => {
                    if (input.people) {
                        book.setPeople(input.people);
                    }
                    return book.update(input);
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    countBooks: function({
        search
    }, context) {
        let options = {};
        if (search !== undefined) {
            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }

        return book.count(options);
    },

    vueTableBook: function(_, context) {
        if (checkAuthorization(context, 'books', 'read') == true) {
            return helper.vueTable(context.request, book, ["id", "title", "genre"]);
        } else {
            return "You don't have authorization to perform this action";
        }
    }
}