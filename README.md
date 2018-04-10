<<<<<<< HEAD
# graphql-sequelize-generic
Example of server using sequelize and graphql with the intention that most of the code
can be generated automatically for a given model.

## Files
server.js    ----- >  only contains server setup

connection.js ----- > credentials for the database

### Given a model the next files will be generated:

model.js ----- > define model with sequelize

resolvers.js ----- > class for basic CRUD operations

## TODO
- [ ] Function for copy resolver to root
- [ ] Generic names for basic resolvers
- [ ] Search arg

=======
# server-graphql-sequelize
Experiment with graphql, postgres, sequelize, nodejs.

CRUD operations for a simple model `Person` with attributes `id`, `firstName`, 
`lastName` and `email`.

## Files
* Set up server working with graphiql (server.js).
* Set up connection with database and creates fake data for database (connection.js). 
* Creates graphql schema with respective resolvers for queries and  mutations (schema.js).

## Run project
*`docker-compose up --build`*

Open Graph*i*QL interface to try queries and mutations at `localhost:3000/graphql`
>>>>>>> refs/remotes/origin/master
