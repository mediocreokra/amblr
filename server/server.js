var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var app = express();
var logger = require('./config/logger.js');

var poiRouter = require('./routers/poiRouter.js');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');

var Strategy = require('passport-local').Strategy;

// configuration variables for server port and mongodb URI
var port = process.env.PORT || 3000;
var dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/app_database';
var env = process.env.NODE_ENV || 'production';

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

// configuring Passport
app.use(cookieParser());
// store and show messages to user that were created in config/passport/signin.js and signup.js
app.use(flash());
app.use(expressSession({secret: 'supersecretpizzapartypassthecheese'}));
app.use(passport.initialize());
app.use(passport.session());

// initialize Passport
var initPassport = require('./config/passport/init');
initPassport(passport);

// middleware to configure routes for all poi-related URIs
app.use('/api/pois', poiRouter);

// middleware to configure routes for all user-related URIs
app.use('/api/users', userRouter);




//listening
app.listen(port, function(err) {
  if (err) {
    return console.log(err);
  }
  console.log('Amblr API server is listening on port: ' + port);
});

module.exports = app;
