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
