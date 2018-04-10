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

