const express = require('express');
//const expressGraphQL = require('express-graphql');
const expressGraphQL = require('express-graphql').graphqlHTTP
const app = express();
const schema = require('./schema/schema');

app.use('/graphql', expressGraphQL({
  schema,
  graqhiql: true
}));

app.listen(4000, () => {
  console.log('Listening');
});
