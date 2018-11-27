/*
    Resolvers for basic CRUD operations
*/

const dog = require('../models/index').dog;
const searchArg = require('../utils/search-argument');
const fileTools = require('../utils/file-tools');
const helper = require('../utils/helper');
const globals = require('../config/globals');
const checkAuthorization = require('../utils/check-authorization');
const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuidv4')

dog.prototype.person = function(_, context) {
    return this.getPerson();
}
dog.prototype.researcher = function(_, context) {
    return this.getResearcher();
}




module.exports = {

    dogs: function({
        search,
        order,
        pagination
    }, context) {
        if (checkAuthorization(context, 'dogs', 'read') == true) {
            let options = {};
            if (search !== undefined) {
                let arg = new searchArg(search);
                let arg_sequelize = arg.toSequelize();
                options['where'] = arg_sequelize;
            }

            return dog.count(options).then(items => {
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
                    throw new Error(`Request of total dogs exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                }
                return dog.findAll(options);
            }).catch(error => {
                console.log("Catched the error in dogs ", error);
                return error;
            });
        } else {
            return new Error("You don't have authorization to perform this action");
        }
    },

    readOneDog: function({
        id
    }, context) {
        if (checkAuthorization(context, 'dogs', 'read') == true) {
            return dog.findOne({
                where: {
                    id: id
                }
            });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    addDog: function(input, context) {
        if (checkAuthorization(context, 'dogs', 'create') == true) {
            return dog.create(input)
                .then(dog => {
                    return dog;
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    bulkAddDogXlsx: function(_, context) {
        let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
        return dog.bulkCreate(xlsxObjs, {
            validate: true
        });
    },

    bulkAddDogCsv: function(_, context) {
        delim = context.request.body.delim;
        cols = context.request.body.cols;
        tmpFile = path.join(__dirname, uuidv4() + '.csv')
        return context.request.files.csv_file.mv(tmpFile).then(() => {
            return fileTools.parseCsvStream(tmpFile, dog, delim, cols)
        }).catch((err) => {
            return new Error(err);
        }).then(() => {
            fs.unlinkSync(tmpFile)
        })
    },

    deleteDog: function({
        id
    }, context) {
        if (checkAuthorization(context, 'dogs', 'delete') == true) {
            return dog.findById(id)
                .then(dog => {
                    return dog.destroy()
                        .then(() => {
                            return 'Item succesfully deleted';
                        });
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    updateDog: function(input, context) {
        if (checkAuthorization(context, 'dogs', 'update') == true) {
            return dog.findById(input.id)
                .then(dog => {
                    return dog.update(input);
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    countDogs: function({
        search
    }, context) {
        let options = {};
        if (search !== undefined) {
            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }

        return dog.count(options);
    },

    vueTableDog: function(_, context) {
        if (checkAuthorization(context, 'dogs', 'read') == true) {
            return helper.vueTable(context.request, dog, ["id", "name", "breed"]);
        } else {
            return "You don't have authorization to perform this action";
        }
    }
}