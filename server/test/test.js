var supertest = require('supertest');
var should = require('should');

var server = supertest.agent('http://localhost:3000');

describe('Basic GET tests:\n  ', function() {

  it('should return a 200 for "/"', function(done){
    server
    .get('/')
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      done();
    });
  });

  it('should return a 404 call when calling a bad endpoint', function(done){
    server
    .get('/noSuchThing')
    .expect(404)
    .end(function(err, res){
      res.status.should.equal(404);
      done();
    });
  });

  it('should return an array of results for "/api/pois"', function(done){
    server
    .get('/api/pois')
    .expect('Content-type',/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      Array.isArray(res.body).should.equal(true);
      done();
    });
  });
});

describe('POST functions:\n  ', function() {

  it('should return the newly created POI when posting "/api/pois"', function(done){
    var postData = {
      'lat': 37.785210,
      'long': -122.411130,
      'type': 'Bad',
      'description': 'Testing POST from mocha test',
      'title': 'MOCHA TEST POST'
    };

    server
    .post('/api/pois')
    .send(postData)
    .expect(201)
    .end(function(err, res){
      // console.log('res is', res.body);
      res.status.should.equal(201);
      res.body.title.should.equal('MOCHA TEST POST');
      done();
    });
  });


  it('should return status 400 and an error when posting incomplete POI data', function(done){
    //postData is missing long and should fail.
    var postData = {
      'lat': 37.785210,
      'type': 'Bad',
      'description': 'Testing POST from mocha test',
      'title': 'MOCHA TEST POST'
    };

    server
    .post('/api/pois')
    .send(postData)
    // .expect('Content-type',/json/)
    .expect(400)
    .end(function(err, res){
      // console.log('res is', err, res);
      res.status.should.equal(400);
      res.should.have.property('error');
      done();
    });
  });

});
