const publisher = require('../models-webservice/publisher');
const searchArg = require('../utils/search-argument');
const resolvers = require('./index');



publisher.prototype.booksFilter = function({
    search,
    order,
    pagination
}, context) {
    if (search === undefined) {
        return resolvers.books({
            "search": {
                "field": "publisherId",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            },
            order,
            pagination
        }, context);
    } else {
        return resolvers.books({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "publisherId",
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

publisher.prototype.countFilteredBooks = function({
    search
}, context) {

    if (search === undefined) {
        return resolvers.countBooks({
            "search": {
                "field": "publisherId",
                "value": {
                    "value": this.id
                },
                "operator": "eq"
            }
        }, context);
    } else {
        return resolvers.countBooks({
            "search": {
                "operator": "and",
                "search": [{
                    "field": "publisherId",
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
    publishers: function({
        search,
        order,
        pagination
    }, context) {
        /*
        YOUR CODE GOES HERE
        */
    },

    readOnePublisher: function({
        id
    }, context) {
        /*
        YOUR CODE GOES HERE
        */
    },

    countPublishers: function({
        search
    }, context) {
        /*
        YOUR CODE GOES HERE
        */
    }
}