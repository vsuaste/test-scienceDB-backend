const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema} = require('graphql');

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: ()=>{
    return{
      hello:{
        type: GraphQLString,
        args:{
          name:{
            type: GraphQLString
          }
        },
        resolve(root, args){
          const n = args.name;
          return `Hello ${args.name}!!`;
        }
      }
    };
  }
});

module.exports.Schema = new GraphQLSchema({
  query: Query
});
