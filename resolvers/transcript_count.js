/*
    Resolvers for basic CRUD operations
*/

const transcript_count = require('../models/index').transcript_count;
const searchArg = require('../utils/search-argument');
const fileTools = require('../utils/file-tools');
const helper = require('../utils/helper');
const globals = require('../config/globals');
const checkAuthorization = require('../utils/check-authorization');
const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuidv4')

transcript_count.prototype.individual = function(_, context) {
    return this.getIndividual();
}




module.exports = {

    transcript_counts: function({
        search,
        order,
        pagination
    }, context) {
        if (checkAuthorization(context, 'transcript_counts', 'read') == true) {
            let options = {};
            if (search !== undefined) {
                let arg = new searchArg(search);
                let arg_sequelize = arg.toSequelize();
                options['where'] = arg_sequelize;
            }

            return transcript_count.count(options).then(items => {
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
                    throw new Error(`Request of total transcript_counts exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                }
                return transcript_count.findAll(options);
            }).catch(error => {
                console.log("Catched the error in transcript_counts ", error);
                return error;
            });
        } else {
            return new Error("You don't have authorization to perform this action");
        }
    },

    readOneTranscript_count: function({
        id
    }, context) {
        if (checkAuthorization(context, 'transcript_counts', 'read') == true) {
            return transcript_count.findOne({
                where: {
                    id: id
                }
            });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    addTranscript_count: function(input, context) {
        if (checkAuthorization(context, 'transcript_counts', 'create') == true) {
            return transcript_count.create(input)
                .then(transcript_count => {
                    return transcript_count;
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    bulkAddTranscript_countXlsx: function(_, context) {
        let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
        return transcript_count.bulkCreate(xlsxObjs, {
            validate: true
        });
    },

    bulkAddTranscript_countCsv: function(_, context) {
        delim = context.request.body.delim;
        cols = context.request.body.cols;
        tmpFile = path.join(__dirname, uuidv4() + '.csv')
        return context.request.files.csv_file.mv(tmpFile).then(() => {
            return fileTools.parseCsvStream(tmpFile, transcript_count, delim, cols)
        }).catch((err) => {
            return new Error(err);
        }).then(() => {
            fs.unlinkSync(tmpFile)
        })
    },

    deleteTranscript_count: function({
        id
    }, context) {
        if (checkAuthorization(context, 'transcript_counts', 'delete') == true) {
            return transcript_count.findById(id)
                .then(transcript_count => {
                    return transcript_count.destroy()
                        .then(() => {
                            return 'Item succesfully deleted';
                        });
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    updateTranscript_count: function(input, context) {
        if (checkAuthorization(context, 'transcript_counts', 'update') == true) {
            return transcript_count.findById(input.id)
                .then(transcript_count => {
                    return transcript_count.update(input);
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    countTranscript_counts: function({
        search
    }, context) {
        let options = {};
        if (search !== undefined) {
            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }

        return transcript_count.count(options);
    },

    vueTableTranscript_count: function(_, context) {
        if (checkAuthorization(context, 'transcript_counts', 'read') == true) {
            return helper.vueTable(context.request, transcript_count, ["id", "gene", "variable", "tissue_or_condition"]);
        } else {
            return "You don't have authorization to perform this action";
        }
    }
}