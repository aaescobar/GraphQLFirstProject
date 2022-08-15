const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql')

const makes = [
    { id: 1, name: 'Toyota' },
    { id: 2, name: 'Honda' },
    { id: 3, name: 'GMC' },
    { id: 4, name: 'VW' }
];

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

//points to a particular record
const RootQuery = new GraphQLObjecType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
        resolve(parentValue, args) { //return a piece of function from our data
            return _.find(users, { id: args.id });
        }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
