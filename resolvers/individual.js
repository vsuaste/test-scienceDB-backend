/*
    Resolvers for basic CRUD operations
*/

const individual = require('../models/index').individual;
const searchArg = require('../utils/search-argument');
const fileTools = require('../utils/file-tools');
const helper = require('../utils/helper');
const globals = require('../config/globals');
const checkAuthorization = require('../utils/check-authorization');
const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuidv4')


individual.prototype.transcript_countsFilter = function({
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

    return this.countTranscript_counts(options).then(items => {
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
            throw new Error(`Request of total transcript_countsFilter exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
        }
        return this.getTranscript_counts(options);
    }).catch(error => {
        console.log("Catched the error in transcript_countsFilter ", error);
        return error;
    });
}

individual.prototype.countFilteredTranscript_counts = function({
    search
}, context) {

    let options = {};

    if (search !== undefined) {
        let arg = new searchArg(search);
        let arg_sequelize = arg.toSequelize();
        options['where'] = arg_sequelize;
    }

    return this.countTranscript_counts(options);
}




module.exports = {

    individuals: function({
        search,
        order,
        pagination
    }, context) {
        if (checkAuthorization(context, 'individuals', 'read') == true) {
            let options = {};
            if (search !== undefined) {
                let arg = new searchArg(search);
                let arg_sequelize = arg.toSequelize();
                options['where'] = arg_sequelize;
            }

            return individual.count(options).then(items => {
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
                    throw new Error(`Request of total individuals exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                }
                return individual.findAll(options);
            }).catch(error => {
                console.log("Catched the error in individuals ", error);
                return error;
            });
        } else {
            return new Error("You don't have authorization to perform this action");
        }
    },

    readOneIndividual: function({
        id
    }, context) {
        if (checkAuthorization(context, 'individuals', 'read') == true) {
            return individual.findOne({
                where: {
                    id: id
                }
            });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    addIndividual: function(input, context) {
        if (checkAuthorization(context, 'individuals', 'create') == true) {
            return individual.create(input)
                .then(individual => {
                    if (input.transcript_counts) {
                        individual.setTranscript_counts(input.transcript_counts);
                    }
                    return individual;
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    bulkAddIndividualXlsx: function(_, context) {
        let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
        return individual.bulkCreate(xlsxObjs, {
            validate: true
        });
    },

    bulkAddIndividualCsv: function(_, context) {
        delim = context.request.body.delim;
        cols = context.request.body.cols;
        tmpFile = path.join(__dirname, uuidv4() + '.csv')
        return context.request.files.csv_file.mv(tmpFile).then(() => {
            return fileTools.parseCsvStream(tmpFile, individual, delim, cols)
        }).catch((err) => {
            return new Error(err);
        }).then(() => {
            fs.unlinkSync(tmpFile)
        })
    },

    deleteIndividual: function({
        id
    }, context) {
        if (checkAuthorization(context, 'individuals', 'delete') == true) {
            return individual.findById(id)
                .then(individual => {
                    return individual.destroy()
                        .then(() => {
                            return 'Item succesfully deleted';
                        });
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    updateIndividual: function(input, context) {
        if (checkAuthorization(context, 'individuals', 'update') == true) {
            return individual.findById(input.id)
                .then(individual => {
                    if (input.transcript_counts) {
                        individual.setTranscript_counts(input.transcript_counts);
                    }
                    return individual.update(input);
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    countIndividuals: function({
        search
    }, context) {
        let options = {};
        if (search !== undefined) {
            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }

        return individual.count(options);
    },

    vueTableIndividual: function(_, context) {
        if (checkAuthorization(context, 'individuals', 'read') == true) {
            return helper.vueTable(context.request, individual, ["id", "name"]);
        } else {
            return "You don't have authorization to perform this action";
        }
    }
}