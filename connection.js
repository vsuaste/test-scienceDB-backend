Sequelize = require('sequelize');
const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $and: Op.and,
  $or: Op.or,
  $like: Op.like,
  $between: Op.between,
  $in: Op.in
};

sequelize = new Sequelize(
  'test_code_gen',
  'test_code_gen',
  'test_code_gen',
  {
    dialect: 'postgres',
    host: '127.0.0.1'
  },
  {operatorsAliases}
);

module.exports = sequelize;
