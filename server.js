const express = require('express')

const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql')
const app = express()


const makes = [
    { id: 1, name: 'Toyota' },
    { id: 2, name: 'Honda' }, 
    { id: 3, name: 'GMC' },
    { id: 4, name: 'VW' }
]

const models = [
    { id: 1, name: 'Corolla', makeId: 1 },
    { id: 2, name: 'Sienna', makeId: 1 },
    { id: 3, name: 'CRV', makeId: 2 },
    { id: 4, name: 'Pilot', makeId: 2 },
    { id: 5, name: 'Yukon', makeId: 3 },
    { id: 6, name: 'Acadia', makeId: 3 },
    { id: 7, name: 'Taos', makeId: 4 },
    { id: 8, name: 'Atlas', makeId: 4 }
]

const ModelType = new GraphQLObjectType({
    name: 'Model',
    description: 'This is the car model',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        makeId: { type: GraphQLNonNull(GraphQLInt) },
        make: {
            type: MakeType,
            resolve: (model) => {
             return makes.find(make => make.id === model.makeId)
            }
         }
    })
})

const MakeType = new GraphQLObjectType({
    name: 'Make',
    description: 'This is the car make',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        models: {
            type: new GraphQLList(ModelType),
            resolve: (make) => {
                return models.filter(model => model.makeId === make.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        model: {
            type: ModelType,
            description: 'A Car Model',
            args: {
                id: { type: GraphQLInt }
            }, 
            resolve: (parent, args) => models.find(model => model.id === args.id)
        },
        models: {
            type: new GraphQLList(ModelType),
            description: 'List of Car Models',
            resolve: () => models
        },
        makes: {
            type: new GraphQLList(MakeType),
            description: 'List of Car Makes',
            resolve: () => makes
        }, 
        make: {
            type: MakeType,
            description: 'A single make',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => makes.find(make => make.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addModel: {
            type: ModelType,
            description: 'Add a Model',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                makeId: { type: GraphQLNonNull(GraphQLInt) },  
            },
            resolve: (parent, args) => {
                const model = { id: models.length + 1, name: args.name, makeId:
                args.makeId }
                models.push(model)
                return model
            }
        },

        addMake: {
            type: MakeType,
            description: 'Add a Make',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }  
            },
            resolve: (parent, args) => {
                const make = { id: makes.length + 1, name: args.name}
                makes.push(make)
                return make
            }
        }
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,
   mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(5000, () => console.log('Server is running'))

//add model
// mutation{
//     addModel(name: "new name", makeId: 1)
//     id
//     name
// }

//show list of models
//  {
//     models{
//       id
//       name
//   }
// }

