const express = require('express');
const graphqlHTTP = require('express-graphql');
const {Schema} = require('./schema');

const APP_PORT = 3000;
const app = express();



app.use('/graphql', graphqlHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

app.listen(APP_PORT, ()=>{
  console.log(`App listening on port ${APP_PORT}`);
});
