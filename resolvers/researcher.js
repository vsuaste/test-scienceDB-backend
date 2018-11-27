/*
    Resolvers for basic CRUD operations
*/

const researcher = require('../models/index').researcher;
const searchArg = require('../utils/search-argument');
const fileTools = require('../utils/file-tools');
const helper = require('../utils/helper');
const globals = require('../config/globals');
const checkAuthorization = require('../utils/check-authorization');
const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuidv4')

researcher.prototype.dog = function(_, context) {
    return this.getDog();
}

researcher.prototype.projectsFilter = function({
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

    return this.countProjects(options).then(items => {
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
            throw new Error(`Request of total projectsFilter exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
        }
        return this.getProjects(options);
    }).catch(error => {
        console.log("Catched the error in projectsFilter ", error);
        return error;
    });
}

researcher.prototype.countFilteredProjects = function({
    search
}, context) {

    let options = {};

    if (search !== undefined) {
        let arg = new searchArg(search);
        let arg_sequelize = arg.toSequelize();
        options['where'] = arg_sequelize;
    }

    return this.countProjects(options);
}




module.exports = {

    researchers: function({
        search,
        order,
        pagination
    }, context) {
        if (checkAuthorization(context, 'researchers', 'read') == true) {
            let options = {};
            if (search !== undefined) {
                let arg = new searchArg(search);
                let arg_sequelize = arg.toSequelize();
                options['where'] = arg_sequelize;
            }

            return researcher.count(options).then(items => {
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
                    throw new Error(`Request of total researchers exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                }
                return researcher.findAll(options);
            }).catch(error => {
                console.log("Catched the error in researchers ", error);
                return error;
            });
        } else {
            return new Error("You don't have authorization to perform this action");
        }
    },

    readOneResearcher: function({
        id
    }, context) {
        if (checkAuthorization(context, 'researchers', 'read') == true) {
            return researcher.findOne({
                where: {
                    id: id
                }
            });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    addResearcher: function(input, context) {
        if (checkAuthorization(context, 'researchers', 'create') == true) {
            return researcher.create(input)
                .then(researcher => {
                    if (input.projects) {
                        researcher.setProjects(input.projects);
                    }
                    return researcher;
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    bulkAddResearcherXlsx: function(_, context) {
        let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
        return researcher.bulkCreate(xlsxObjs, {
            validate: true
        });
    },

    bulkAddResearcherCsv: function(_, context) {
        delim = context.request.body.delim;
        cols = context.request.body.cols;
        tmpFile = path.join(__dirname, uuidv4() + '.csv')
        return context.request.files.csv_file.mv(tmpFile).then(() => {
            return fileTools.parseCsvStream(tmpFile, researcher, delim, cols)
        }).catch((err) => {
            return new Error(err);
        }).then(() => {
            fs.unlinkSync(tmpFile)
        })
    },

    deleteResearcher: function({
        id
    }, context) {
        if (checkAuthorization(context, 'researchers', 'delete') == true) {
            return researcher.findById(id)
                .then(researcher => {
                    return researcher.destroy()
                        .then(() => {
                            return 'Item succesfully deleted';
                        });
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    updateResearcher: function(input, context) {
        if (checkAuthorization(context, 'researchers', 'update') == true) {
            return researcher.findById(input.id)
                .then(researcher => {
                    if (input.projects) {
                        researcher.setProjects(input.projects);
                    }
                    return researcher.update(input);
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    countResearchers: function({
        search
    }, context) {
        let options = {};
        if (search !== undefined) {
            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }

        return researcher.count(options);
    },

    vueTableResearcher: function(_, context) {
        if (checkAuthorization(context, 'researchers', 'read') == true) {
            return helper.vueTable(context.request, researcher, ["id", "firstName", "lastName", "email"]);
        } else {
            return "You don't have authorization to perform this action";
        }
    }
}