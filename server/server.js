var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var app = express();
var logger = require('./config/logger.js');

var poiRouter = require('./routers/poiRouter.js');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

// configuration variables for server port and mongodb URI
var port = process.env.PORT || 3000;
var dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/app_database';

//create connection to mongodb
mongoose.connect(dbUri);


// log db connection success or error
// TODO: update to use winston logging
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connection to mongoose!');
});

console.log('stream: ' + logger.stream);

app.use(require('morgan')('combined', { 'stream': logger.stream }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//serve static files
app.use(express.static(__dirname + '/../client/www'));

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
  next();
});

// middleware to configure routes for all poi related URI's
app.use('/api/pois', poiRouter);

//listening
app.listen(port, function(err) {
  if (err) {
    return console.log(err);
  }
  console.log('Amblr API server is listening on port: ' + port);
});

module.exports = app;
