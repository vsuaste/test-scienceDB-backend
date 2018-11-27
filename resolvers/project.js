/*
    Resolvers for basic CRUD operations
*/

const project = require('../models/index').project;
const searchArg = require('../utils/search-argument');
const fileTools = require('../utils/file-tools');
const helper = require('../utils/helper');
const globals = require('../config/globals');
const checkAuthorization = require('../utils/check-authorization');
const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuidv4')
const specie = require('./specie');


project.prototype.researchersFilter = function({
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

    return this.countResearchers(options).then(items => {
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
            throw new Error(`Request of total researchersFilter exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
        }
        return this.getResearchers(options);
    }).catch(error => {
        console.log("Catched the error in researchersFilter ", error);
        return error;
    });
}

project.prototype.countFilteredResearchers = function({
    search
}, context) {

    let options = {};

    if (search !== undefined) {
        let arg = new searchArg(search);
        let arg_sequelize = arg.toSequelize();
        options['where'] = arg_sequelize;
    }

    return this.countResearchers(options);
}

project.prototype.specie = function(_, context) {
    return specie.readOneSpecie({
        "id": this.specieId
    }, context);
}



module.exports = {

    projects: function({
        search,
        order,
        pagination
    }, context) {
        if (checkAuthorization(context, 'projects', 'read') == true) {
            let options = {};
            if (search !== undefined) {
                let arg = new searchArg(search);
                let arg_sequelize = arg.toSequelize();
                options['where'] = arg_sequelize;
            }

            return project.count(options).then(items => {
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
                    throw new Error(`Request of total projects exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                }
                return project.findAll(options);
            }).catch(error => {
                console.log("Catched the error in projects ", error);
                return error;
            });
        } else {
            return new Error("You don't have authorization to perform this action");
        }
    },

    readOneProject: function({
        id
    }, context) {
        if (checkAuthorization(context, 'projects', 'read') == true) {
            return project.findOne({
                where: {
                    id: id
                }
            });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    addProject: function(input, context) {
        if (checkAuthorization(context, 'projects', 'create') == true) {
            return project.create(input)
                .then(project => {
                    if (input.researchers) {
                        project.setResearchers(input.researchers);
                    }
                    return project;
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    bulkAddProjectXlsx: function(_, context) {
        let xlsxObjs = fileTools.parseXlsx(context.request.files.xlsx_file.data.toString('binary'));
        return project.bulkCreate(xlsxObjs, {
            validate: true
        });
    },

    bulkAddProjectCsv: function(_, context) {
        delim = context.request.body.delim;
        cols = context.request.body.cols;
        tmpFile = path.join(__dirname, uuidv4() + '.csv')
        return context.request.files.csv_file.mv(tmpFile).then(() => {
            return fileTools.parseCsvStream(tmpFile, project, delim, cols)
        }).catch((err) => {
            return new Error(err);
        }).then(() => {
            fs.unlinkSync(tmpFile)
        })
    },

    deleteProject: function({
        id
    }, context) {
        if (checkAuthorization(context, 'projects', 'delete') == true) {
            return project.findById(id)
                .then(project => {
                    return project.destroy()
                        .then(() => {
                            return 'Item succesfully deleted';
                        });
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    updateProject: function(input, context) {
        if (checkAuthorization(context, 'projects', 'update') == true) {
            return project.findById(input.id)
                .then(project => {
                    if (input.researchers) {
                        project.setResearchers(input.researchers);
                    }
                    return project.update(input);
                });
        } else {
            return "You don't have authorization to perform this action";
        }
    },

    countProjects: function({
        search
    }, context) {
        let options = {};
        if (search !== undefined) {
            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }

        return project.count(options);
    },

    vueTableProject: function(_, context) {
        if (checkAuthorization(context, 'projects', 'read') == true) {
            return helper.vueTable(context.request, project, ["id", "name", "description"]);
        } else {
            return "You don't have authorization to perform this action";
        }
    }
}