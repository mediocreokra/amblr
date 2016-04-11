var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var poi = require('./controllers/poiController.js');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//serve static files
app.use(express.static(__dirname + '/../client/app'));
app.use(express.static(__dirname + '/../client/www'));

//post request from form input

//require(route file)(app, express)
// app.post('/form', function(req, res) {
//   poi.savePOI(req, res);

// });


app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

require('./config/routes.js')(app, express);

//listening
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
