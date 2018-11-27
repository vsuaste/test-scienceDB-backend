/*
    Resolvers for basic CRUD operations
*/

const person = require('../models/index').person;
const searchArg = require('../utils/search-argument');
const fileTools = require('../utils/file-tools');
const helper = require('../utils/helper');
const globals = require('../config/globals');
const checkAuthorization = require('../utils/check-authorization');
const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuidv4')


person.prototype.dogsFilter = function({
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

    return this.countDogs(options).then(items => {
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
            throw new Error(`Request of total dogsFilter exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
        }
        return this.getDogs(options);
    }).catch(error => {
        console.log("Catched the error in dogsFilter ", error);
        return error;
    });
}

person.prototype.countFilteredDogs = function({
    search
}, context) {

    let options = {};

    if (search !== undefined) {
        let arg = new searchArg(search);
        let arg_sequelize = arg.toSequelize();
        options['where'] = arg_sequelize;
    }

    return this.countDogs(options);
}

person.prototype.booksFilter = function({
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

    return this.countBooks(options).then(items => {
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
            throw new Error(`Request of total booksFilter exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
        }
        return this.getBooks(options);
    }).catch(error => {
        console.log("Catched the error in booksFilter ", error);
        return error;
    });
}

person.prototype.countFilteredBooks = function({
    search
}, context) {

    let options = {};

    if (search !== undefined) {
        let arg = new searchArg(search);
        let arg_sequelize = arg.toSequelize();
        options['where'] = arg_sequelize;
    }

    return this.countBooks(options);
}




module.exports = {

    people: function({
        search,
        order,
        pagination
    }, context) {
        if (checkAuthorization(context, 'people', 'read') == true) {
            let options = {};
            if (search !== undefined) {
                let arg = new searchArg(search);
                let arg_sequelize = arg.toSequelize();
                options['where'] = arg_sequelize;
            }

            return person.count(options).then(items => {
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
                    throw new Error(`Request of total people exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                }
                return person.findAll(options);
            }).catch(error => {
                console.log("Catched the error in people ", error);
                return error;
            });
        } else {
            return new Error("You don't have authorization to perform this action");
        }
    },

    readOnePerson: function({
        id
    }, context) {
        if (checkAuthorization(context, 'people', 'read') == true) {
            return person.findOne({
                where: {
                    id: id
                }
            });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    addPerson: function(input, context) {
        if (checkAuthorization(context, 'people', 'create') == true) {
            return person.create(input)
                .then(person => {
                    if (input.dogs) {
                        person.setDogs(input.dogs);
                    }
                    if (input.books) {
                        person.setBooks(input.books);
                    }
                    return person;
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    bulkAddPersonXlsx: function(_, context) {
        let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
        return person.bulkCreate(xlsxObjs, {
            validate: true
        });
    },

    bulkAddPersonCsv: function(_, context) {
        delim = context.request.body.delim;
        cols = context.request.body.cols;
        tmpFile = path.join(__dirname, uuidv4() + '.csv')
        return context.request.files.csv_file.mv(tmpFile).then(() => {
            return fileTools.parseCsvStream(tmpFile, person, delim, cols)
        }).catch((err) => {
            return new Error(err);
        }).then(() => {
            fs.unlinkSync(tmpFile)
        })
    },

    deletePerson: function({
        id
    }, context) {
        if (checkAuthorization(context, 'people', 'delete') == true) {
            return person.findById(id)
                .then(person => {
                    return person.destroy()
                        .then(() => {
                            return 'Item succesfully deleted';
                        });
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    updatePerson: function(input, context) {
        if (checkAuthorization(context, 'people', 'update') == true) {
            return person.findById(input.id)
                .then(person => {
                    if (input.dogs) {
                        person.setDogs(input.dogs);
                    }
                    if (input.books) {
                        person.setBooks(input.books);
                    }
                    return person.update(input);
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    countPeople: function({
        search
    }, context) {
        let options = {};
        if (search !== undefined) {
            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }

        return person.count(options);
    },

    vueTablePerson: function(_, context) {
        if (checkAuthorization(context, 'people', 'read') == true) {
            return helper.vueTable(context.request, person, ["id", "firstName", "lastName", "email"]);
        } else {
            return "You don't have authorization to perform this action";
        }
    }
}