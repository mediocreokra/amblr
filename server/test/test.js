var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");

describe("Basic server test", function() {

  it("should return a 200 call when call get '/'", function(done){
    server
    .get('/')
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      done();
    });
  });

  it("should return a 404 call when calling get on a bad enpoint", function(done){
    server
    .get('/noSuchThing')
    .expect(404)
    .end(function(err, res){
      res.status.should.equal(404);
      done();
    });
  });

  it("should return an array of results when get '/api/pois'", function(done){
    server
    .get('/api/pois')
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      // console.log('res is', Array.isArray(res.body));
      res.status.should.equal(200);
      Array.isArray(res.body).should.equal(true);
      done();
    });
  });

});