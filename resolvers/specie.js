const specie = require('../models-webservice/specie');
const searchArg = require('../utils/search-argument');
const resolvers = require('./index');



specie.prototype.projectsFilter = function({
    search,
    order,
    pagination
}, context) {
    if (search === undefined) {
        return resolvers.projects({
            "search": {
                "field": "specieId",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            },
            order,
            pagination
        }, context);
    } else {
        return resolvers.projects({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "specieId",
                    "value": {
                        "value": this.id
                    },
                    "operator": "eq"
                }, search]
            },
            order,
            pagination
        }, context)
    }

}

specie.prototype.countFilteredProjects = function({
    search
}, context) {

    if (search === undefined) {
        return resolvers.countProjects({
            "search": {
                "field": "specieId",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            }
        }, context);
    } else {
        return resolvers.countProjects({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "specieId",
                    "value": {
                        "value": this.id
                    },
                    "operator": "eq"
                }, search]
            }
        }, context)
    }

}



module.exports = {
    species: function({
        search,
        order,
        pagination
    }, context) {
        /*
        YOUR CODE GOES HERE
        */
    },

    readOneSpecie: function({
        id
    }, context) {
        /*
        YOUR CODE GOES HERE
        */
    },

    countSpecies: function({
        search
    }, context) {
        /*
        YOUR CODE GOES HERE
        */
    }
}