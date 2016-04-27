var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var app = module.exports = express();
var logger = require('./config/logger.js');
var fs = require('fs');
var https = require('https');

var poiRouter = require('./routers/poiRouter.js');
var userRouter = require('./routers/userRouter.js');


// configuration variables for server port and mongodb URI
var port = process.env.PORT || 4443;
var dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/app_database';
var env = process.env.NODE_ENV || 'production';

//create connection to mongodb
mongoose.connect(dbUri);

// log db connection success or error
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connection to mongoose!');
});

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

// middleware to configure routes for all poi-related URIs
app.use('/api/pois', poiRouter);

// middleware to configure routes for all user-related URIs
app.use('/api/users', userRouter);


var options = {
  key: fs.readFileSync('./config/keys/privKey.pem'),
  cert: fs.readFileSync('./config/keys/cert.pem')
};

// Create an HTTPS service 
https.createServer(options, app).listen(port);







