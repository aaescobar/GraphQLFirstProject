const express = require('express');
//const expressGraphQL = require('express-graphql');
const expressGraphQL = require('express-graphql').graphqlHTTP
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', expressGraphQL({
  schema: schema,
  graqhiql: true
}));

app.listen(4000, () => {
  console.log('Listening');
});
