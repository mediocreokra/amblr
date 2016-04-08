var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');

//create connection to mongodb
mongoose.connect('mongodb://localhost/app_database');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connection to mongoose!');
});



///logger
app.use(morgan('dev'));

//get request to root
app.get('/', function(req, res) {
  res.send('Hello World!');
});

//listening
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

