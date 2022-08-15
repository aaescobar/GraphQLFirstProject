const graphql = require('graphql');
//const _ = require('lodash'); we wont be needing static makes
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = graphql;


/* "We will be using db.json to no longer need static data"
    // const makes = [
    //     { id: 1, name: 'Toyota' },
    //     { id: 2, name: 'Honda' },
    //     { id: 3, name: 'GMC' },
    //     { id: 4, name: 'VW' }
    // ];
*/

const MakeType = new GraphQLObjectType({
    name: 'Make',
    description: 'This is the car make',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        models: {
            type: new GraphQLList(ModelType),
            resolve(parentValue, args) {
              return axios.get(`http://localhost:3000/makes/${parentValue.id}/models`)
                .then(res => res.data)
            }
        }
    })
});

const ModelType = new GraphQLObjectType({
  name: "Model",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    bodySize: { type: GraphQLString },
    make: {
      type: MakeType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  })
});

//points to a particular record
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: ModelType,
      args: { id: { type: GraphQLString } },
        resolve(parentValue, args) { //return a piece of function from our data
            /*no longer need this statement
              //return _.find(users, { id: args.id });
            */
            return axios.get(`http://localhost:3000/makes/${args.id}`)
              .then(resp => resp.data)//make request take response and return data
        }
    },

    make: {
      type: MakeType,
      args: { id: { type: GraphQLString }},
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addModel: {
      type: ModelType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        bodySize: { type: GraphQLString },
        makeId: { type: GraphQLString }
      },
      resolve(parentValue, { name, bodySize, makeId }){
        return axios.post(`http://localhost:3000/models`, {name, bodySize, makeId })
          .then(res => res.data);
      }

    },

    deleteModel: {
      type: ModelType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/models/${id}`)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  mutation,
  query: RootQuery
});
