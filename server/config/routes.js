var poiController = require('../controllers/poiController.js');


//include all routes, takes in controller methods to be used
module.exports = function(app, express) {
  app.post('/form', poiController.savePOI);  
  app.get('/', poiController.getAllPOI);
  app.get('/api/allPOI', poiController.getAllPOI);
}