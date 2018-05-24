var server = require('../server');
const request = require('supertest');
const test = require('./test-data');

const chai = require('chai');
const expect = chai.expect;

describe('Testing Server GraphQL', ()=>{
  it('Returns people and all their initial attributes', (done)=>{
    request(server).post('/graphql')
    .send({query: '{people{ firstName lastName email}}'})
    .expect(200).end((err,res)=>{
      if(err){
        console.log(err);
        done(err);
      }
      expect(res.body.data.people).to.deep.equal(test.people);
      done();
    });

  });
});

server.close();
