var poiRouter = require('express').Router();
var poiController = require('../controllers/poiController.js');

// Declare all routes for poi's and specify what controller method we're going to use for each

// the path '/api/pois' is already prepended to all routes based on app.use statement in server.js
poiRouter.route('/').get(poiController.getAllPOI);
poiRouter.route('/').post(poiController.savePOI);

module.exports = poiRouter;
