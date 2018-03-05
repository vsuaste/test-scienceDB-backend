const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull} = require('graphql');
  const {connection} = require('./connection');
  const {or,like} = Sequelize.Op;

  const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'This represents a Person',
    fields: () =>{
      return{
        id:{
          type: GraphQLInt,
          resolve(person){
            return person.id;
          }
        },
        firstName:{
          type: GraphQLString,
          resolve(person){
            return person.firstName;
          }
        },
        lastName:{
          type: GraphQLString,
          resolve(person){
            return person.lastName;
          }
        },
        email:{
          type: GraphQLString,
          resolve(person){
            return person.email;
          }
        },
      };
    }
  });


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
          return `Hello ${args.name}!!`;
        }
      },

      people:{
        type: new GraphQLList(Person),
        args:{
          id:{
            type: GraphQLInt
          },
          email:{
            type: GraphQLString
          }
        },
        resolve(root, args){
          return connection.models.person.findAll({where: args});
        }
      },

      readOne:{
        type: Person,
        args:{
          id:{
            type: GraphQLInt
          }
        },
        resolve(root,args){
          return connection.models.person.findOne({where: args});
        }
      },

      read:{
        type: new GraphQLList(Person),
        args:{
          searchArg:{
            type: GraphQLString
          }
        },
        resolve(root,args){
          return connection.models.person.findAll({
            where: {
              [or]: [
                {firstName: {[like]: '%'+args.searchArg + '%'} },
                {lastName: {[like]: '%'+args.searchArg + '%'} },
                {email: {[like]: '%'+args.searchArg + '%'} }
              ]
            }
          });
        }
      }


    };
  }
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to modify data base',
  fields: ()=>{
    return{
      addPerson:{
        type: Person,
        args:{
          firstName:{
            type: new GraphQLNonNull(GraphQLString),
          },
          lastName:{
            type: new GraphQLNonNull(GraphQLString),
          },
          email:{
            type: new GraphQLNonNull(GraphQLString),
          }
        },
        resolve(_,args){
          return connection.models.person.create({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email
          });
        }
      },

      deletePerson:{
        type: GraphQLString,//Person,
        args:{
          id:{
            type: new GraphQLNonNull(GraphQLInt),
          }
        },
        resolve(_,args){
        return connection.models.person
          .findById(args.id)
          .then( person =>{
              return person
              .destroy()
              .then(()=>{return 'Item succesfully deleted';});
          });
        }
      },

      updatePerson:{
        type: Person,
        args:{
          id:{
            type: new GraphQLNonNull(GraphQLInt),
          },
          firstName:{
            type: GraphQLString
          },
          lastName:{
            type: GraphQLString
          },
          email:{
            type: GraphQLString
          }
        },
        resolve(_,args){
          return connection.models.person
          .findById(args.id)
          .then( person => {
            return person.update({
              firstName: args.firstName || person.firstName,
              lastName: args.lastName || person.lastName,
              email: args.email || person.email,
            })
            .then(()=>{ return person;});
          });
        }
      }
    };
  }
});



module.exports.Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
