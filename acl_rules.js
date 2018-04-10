module.exports = {
  aclRules: [{
    roles: 'administrator',
    allows: [{
      permissions: '*'
    }]
  },
  {
    roles: 'guest',
    allows: [{
      permissions: 'get'
    }]
  }]
}
