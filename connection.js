Sequelize = require('sequelize');
_ = require('lodash');
 Faker = require('faker');

const Conn = new Sequelize(
  /*'tutorial',
  'tutorial',
  'tutorial',*/
  'postgres',
  'postgres',
  'postgres',
  {
    dialect: 'postgres',
    //host: '127.0.0.1'
    host: 'db',
  }
);

const Person = Conn.define('person',{
  firstName:{
    type: Sequelize.STRING,
    allowNull:false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNul:false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

//Generate fake data for table
Conn.sync({force: true}).then(()=> {
    _.times(15, ()=>{
      return Person.create({
        firstName: Faker.name.firstName(),
        lastName: Faker.name.lastName(),
        email: Faker.internet.email()
      }).then( person => {
        return person;
        })
      });
    });


module.exports.connection = Conn;
